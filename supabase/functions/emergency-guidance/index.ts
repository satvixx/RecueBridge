Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const description: string = String(body.description ?? "").trim();

    if (!description) {
      return new Response(
        JSON.stringify({ error: "Description is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");

    // If no AI key is configured, fall back to keyword-based guidance.
    if (!apiKey) {
      return new Response(
        JSON.stringify(buildFallbackGuidance(description)),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt =
      "You are a safety-focused emergency communication assistant, not a doctor, nurse, paramedic, or replacement for emergency services. " +
      "You never diagnose, identify conditions, or give a medical opinion. Your role is to help the caller contact emergency services and take simple, safe next steps. " +
      "Give simple, calm, short instructions for a stressed bystander. Put calling emergency services first when danger may be immediate. " +
      "Never tell the user to delay calling emergency services. Never suggest the situation is not serious. " +
      "Give no more than five steps. Each step must be a short, single, actionable instruction. " +
      "Avoid dangerous or complex medical procedures. Tell the user not to put themselves in danger and to follow the dispatcher's instructions. " +
      "If the situation is unclear, recommend calling emergency services. " +
      "Do not use diagnostic language like 'this is a heart attack' or 'you have a fracture'. Instead say 'possible chest pain' or 'possible injury'. " +
      "If the user mentions suicide, self-harm, suicidal thoughts, wanting to hurt themselves, or a mental health crisis, classify it as a mental health crisis — not as a physical injury. " +
      "Respond ONLY with valid JSON in this exact shape: " +
      '{"emergencyType":"string (no diagnosis, e.g. Possible severe bleeding)","urgency":"immediate | urgent | caution","openingMessage":"short calming sentence","steps":["short actionable instruction"],"doNotDo":["short safety warning"],"dispatcherSummary":"concise summary for the dispatcher, no diagnosis"}';

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: description },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text().catch(() => "");
      console.error("OpenAI error:", openaiRes.status, errText);
      return new Response(
        JSON.stringify(buildFallbackGuidance(description)),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await openaiRes.json();
    const content = data?.choices?.[0]?.message?.content;

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      return new Response(
        JSON.stringify(buildFallbackGuidance(description)),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!isValidGuidance(parsed)) {
      return new Response(
        JSON.stringify(buildFallbackGuidance(description)),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

interface Guidance {
  emergencyType: string;
  urgency: "immediate" | "urgent" | "caution";
  openingMessage: string;
  steps: string[];
  doNotDo: string[];
  dispatcherSummary: string;
}

function isValidGuidance(value: unknown): value is Guidance {
  if (typeof value !== "object" || value === null) return false;
  const g = value as Record<string, unknown>;
  return (
    typeof g.emergencyType === "string" &&
    ["immediate", "urgent", "caution"].includes(g.urgency as string) &&
    typeof g.openingMessage === "string" &&
    Array.isArray(g.steps) &&
    Array.isArray(g.doNotDo) &&
    typeof g.dispatcherSummary === "string"
  );
}

function buildFallbackGuidance(description: string): Guidance {
  const text = description.toLowerCase();
  const matchers: Array<[string[], Guidance]> = [
    [
      ["bleed", "blood", "cut", "wound"],
      {
        emergencyType: "Severe bleeding",
        urgency: "immediate",
        openingMessage: "Stay calm. You can help — call emergency services right away.",
        steps: [
          "Call your local emergency number now.",
          "Put firm, steady pressure on the wound with a clean cloth.",
          "Keep pressing — do not lift the cloth to check. Add more cloth on top if it soaks through.",
          "Keep the injured area still and raise it above the heart if possible.",
          "Stay with the person and follow the dispatcher's instructions.",
        ],
        doNotDo: [
          "Do not use a tourniquet unless a dispatcher tells you to.",
          "Do not remove an object that is stuck in the wound.",
          "Do not give the person anything to eat or drink.",
        ],
        dispatcherSummary:
          "A person is bleeding heavily from an injury. Pressure is being applied. Emergency help is needed immediately.",
      },
    ],
    [
      ["breath", "choking", "asthma", "wheez", "cannot breathe"],
      {
        emergencyType: "Trouble breathing",
        urgency: "immediate",
        openingMessage: "This is serious. Call emergency services right away.",
        steps: [
          "Call your local emergency number now.",
          "Help the person sit upright and lean slightly forward.",
          "Loosen tight clothing around the neck and chest.",
          "Ask if they have a rescue inhaler and help them use it.",
          "Stay calm and reassure them while you wait for help.",
        ],
        doNotDo: [
          "Do not lay the person flat if they struggle to breathe sitting up.",
          "Do not give them water or food.",
          "Do not leave them alone.",
        ],
        dispatcherSummary:
          "A person is having severe difficulty breathing. They are sitting upright. Emergency help is needed immediately.",
      },
    ],
    [
      ["unconscious", "unresponsive", "not responding", "passed out", "fainted"],
      {
        emergencyType: "Unconscious person",
        urgency: "immediate",
        openingMessage: "Act quickly. Call emergency services and follow their guidance.",
        steps: [
          "Call your local emergency number now.",
          "Check if the person responds when you speak or gently shake their shoulder.",
          "If they are not breathing normally, the dispatcher will guide you on CPR — follow their instructions exactly.",
          "If breathing, gently roll them onto their side into the recovery position.",
          "Stay with them and watch their breathing until help arrives.",
        ],
        doNotDo: [
          "Do not move the person unless they are in danger.",
          "Do not give them food or water.",
          "Do not put anything in their mouth.",
        ],
        dispatcherSummary:
          "A person is unresponsive. Breathing status is being checked. Emergency help is needed immediately.",
      },
    ],
    [
      ["chest pain", "heart", "chest pressure", "chest tight"],
      {
        emergencyType: "Chest pain",
        urgency: "immediate",
        openingMessage: "Chest pain can be serious. Call emergency services right away.",
        steps: [
          "Call your local emergency number now.",
          "Have the person sit down and stay as still and calm as possible.",
          "Loosen tight clothing around the chest.",
          "If the dispatcher advises and the person has prescribed medication, help them take it.",
          "Stay with them and follow the dispatcher's instructions.",
        ],
        doNotDo: [
          "Do not let the person walk or exert themselves.",
          "Do not give them food or water.",
          "Do not assume it is just indigestion.",
        ],
        dispatcherSummary:
          "A person is reporting chest pain. They are sitting still. Emergency help is needed immediately.",
      },
    ],
    [
      ["fire", "smoke", "burn", "flame", "burning"],
      {
        emergencyType: "Fire or smoke",
        urgency: "immediate",
        openingMessage: "Get out first, then call. Your safety comes first.",
        steps: [
          "Leave the building immediately if you can do so safely.",
          "Stay low to the ground to avoid smoke.",
          "Once safe, call your local emergency number.",
          "Do not go back inside for any reason.",
          "Tell the dispatcher where the fire is and whether anyone is still inside.",
        ],
        doNotDo: [
          "Do not go back inside a burning building.",
          "Do not use elevators.",
          "Do not try to fight a large fire yourself.",
        ],
        dispatcherSummary:
          "There is a fire with smoke. People are evacuating. Location and possible trapped occupants are being reported.",
      },
    ],
    [
      ["poison", "overdose", "swallowed", "toxic", "chemical"],
      {
        emergencyType: "Suspected poisoning",
        urgency: "urgent",
        openingMessage: "Call emergency services. Do not try to treat this yourself.",
        steps: [
          "Call your local emergency number now.",
          "Move the person to fresh air if the poison is a gas or fumes.",
          "Take the container or label of what was taken, if it is safe to do so.",
          "Do not make the person vomit unless the dispatcher tells you to.",
          "Follow the dispatcher's instructions exactly.",
        ],
        doNotDo: [
          "Do not make the person vomit.",
          "Do not give them anything to eat or drink unless told to.",
          "Do not wait for symptoms to get worse before calling.",
        ],
        dispatcherSummary:
          "A person may have been poisoned. The substance is being identified for the dispatcher. Emergency help is needed.",
      },
    ],
    [
      ["mental health", "suicide", "suicidal", "self-harm", "self harm", "hurt myself", "kill myself", "end my life", "crisis", "depressed", "hopeless"],
      {
        emergencyType: "Mental health crisis",
        urgency: "urgent",
        openingMessage:
          "You do not have to handle this alone. If you may hurt yourself or someone else, contact emergency services now.",
        steps: [
          "If there is immediate danger of harm, call your local emergency number now.",
          "Stay with the person and keep them safe until help arrives.",
          "Listen without judgment — do not argue or dismiss their feelings.",
          "Call a crisis hotline for support and guidance.",
          "Follow the dispatcher or crisis counselor's instructions exactly.",
        ],
        doNotDo: [
          "Do not leave the person alone if they may be at risk.",
          "Do not try to diagnose or minimize what they are going through.",
          "Do not delay calling emergency services if there is any risk of harm.",
        ],
        dispatcherSummary:
          "A person may be experiencing a mental health crisis. Risk of harm is being assessed. Support and emergency help may be needed.",
      },
    ],
    [
      ["broken", "fracture", "injury", "hurt", "fell", "fall", "sprain"],
      {
        emergencyType: "Serious injury",
        urgency: "urgent",
        openingMessage: "Stay calm. Call emergency services and keep the person still.",
        steps: [
          "Call your local emergency number now.",
          "Keep the injured person still — do not move them unless they are in danger.",
          "Apply gentle pressure to any bleeding with a clean cloth.",
          "Keep them warm and comfortable while you wait.",
          "Follow the dispatcher's instructions.",
        ],
        doNotDo: [
          "Do not move the person unless they are in danger.",
          "Do not try to push bones back into place.",
          "Do not give them food or drink.",
        ],
        dispatcherSummary:
          "A person has a serious injury. They are being kept still. Emergency help is needed.",
      },
    ],
    [
      ["unsafe", "violent", "attack", "threat", "weapon", "assault", "fight"],
      {
        emergencyType: "Unsafe or violent situation",
        urgency: "immediate",
        openingMessage: "Your safety is the priority. Get to a safe place first.",
        steps: [
          "Move away from danger if you can do so safely.",
          "Once safe, call your local emergency number.",
          "Tell the dispatcher where you are and what is happening.",
          "Stay hidden and quiet if you cannot leave.",
          "Do not confront anyone — wait for help to arrive.",
        ],
        doNotDo: [
          "Do not put yourself in danger to help someone else.",
          "Do not confront a violent person.",
          "Do not hang up unless the dispatcher tells you to.",
        ],
        dispatcherSummary:
          "There is an unsafe or violent situation. The caller is reporting location and what is happening. Emergency help is needed immediately.",
      },
    ],
  ];

  for (const [keywords, guidance] of matchers) {
    if (keywords.some((kw) => text.includes(kw))) {
      return guidance;
    }
  }

  return {
    emergencyType: "Other emergency",
    urgency: "urgent",
    openingMessage:
      "When in doubt, call emergency services. It is better to ask for help.",
    steps: [
      "Call your local emergency number now.",
      "Describe clearly what is happening and where you are.",
      "Stay with the person who needs help.",
      "Follow the dispatcher's instructions exactly.",
      "Do not hang up unless the dispatcher tells you to.",
    ],
    doNotDo: [
      "Do not put yourself in danger.",
      "Do not delay calling if the situation might be serious.",
      "Do not give the person food or drink unless the dispatcher says so.",
    ],
    dispatcherSummary:
      "An emergency situation is being reported. Details are being provided to the dispatcher. Emergency help is needed.",
  };
}
