import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types

load_dotenv()

app = FastAPI(title="PickMyTech AI Recommendation Engine")

# Enable CORS for frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini client using environment variable
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Request Schema from Frontend
class RecommendationRequest(BaseModel):
    category: str
    budget: float
    use_case: str
    brand_pref: str = "Any"

# Output Schemas for Gemini Structured Response
class ProductRecommendation(BaseModel):
    model_name: str
    estimated_price_inr: float
    key_specs: list[str]
    why_recommended: str

class RecommendationResponse(BaseModel):
    recommendations: list[ProductRecommendation] = []
    fallback_message: str | None = None
    next_steps: list[str] | None = None
    floor_price: float | None = None
    cutoff_price: float | None = None

CATEGORY_FLOORS = {
    "laptops": {
        "floor": 74990,
        "cutoff": 37495,
        "fallback": "No laptops are available at this budget. The cheapest options start around ₹74,990.",
        "adjacent": "refurbished/pre-owned laptops or desktop PCs"
    },
    "smartphones": {
        "floor": 6999,
        "cutoff": 3500,
        "fallback": "No smartphones are available at this budget. The cheapest options start around ₹6,999.",
        "adjacent": "refurbished/pre-owned smartphones or feature phones"
    },
    "wireless earbuds": {
        "floor": 999,
        "cutoff": 500,
        "fallback": "No reliable wireless earbuds are available at this budget. The cheapest options start around ₹999.",
        "adjacent": "wired earphones instead of TWS earbuds"
    },
    "tws": {
        "floor": 999,
        "cutoff": 500,
        "fallback": "No reliable wireless earbuds are available at this budget. The cheapest options start around ₹999.",
        "adjacent": "wired earphones instead of TWS earbuds"
    },
    "smartwatches": {
        "floor": 1499,
        "cutoff": 750,
        "fallback": "No smartwatches are available at this budget. The cheapest options start around ₹1,499.",
        "adjacent": "fitness bands or traditional timepieces"
    }
}

SUBCATEGORY_FLOORS = {
    "gaming laptops": {
        "floor": 55000,
        "cutoff": 27500,
        "fallback": "No gaming laptops are available at this budget. The cheapest options start around ₹55,000.",
        "adjacent": "refurbished gaming laptops or entry-level desktop PCs"
    },
    "gaming laptop": {
        "floor": 55000,
        "cutoff": 27500,
        "fallback": "No gaming laptops are available at this budget. The cheapest options start around ₹55,000.",
        "adjacent": "refurbished gaming laptops or entry-level desktop PCs"
    },
    "flagship smartphones": {
        "floor": 50000,
        "cutoff": 25000,
        "fallback": "No flagship smartphones are available at this budget. The cheapest options start around ₹50,000.",
        "adjacent": "upper midrange smartphones or refurbished flagship phones"
    },
    "flagship smartphone": {
        "floor": 50000,
        "cutoff": 25000,
        "fallback": "No flagship smartphones are available at this budget. The cheapest options start around ₹50,000.",
        "adjacent": "upper midrange smartphones or refurbished flagship phones"
    },
    "gaming smartphones": {
        "floor": 20000,
        "cutoff": 10000,
        "fallback": "No gaming smartphones are available at this budget. The cheapest options start around ₹20,000.",
        "adjacent": "budget smartphones with gaming modes"
    },
    "content creation laptops": {
        "floor": 60000,
        "cutoff": 30000,
        "fallback": "No content creation laptops are available at this budget. The cheapest options start around ₹60,000.",
        "adjacent": "refurbished workstation laptops or desktop computers"
    }
}

def validate_budget(category: str, budget: float, use_case: str = ""):
    cat_lower = category.lower().strip()
    use_case_lower = use_case.lower().strip()
    combined_key = f"{use_case_lower} {cat_lower}".strip()

    config = None
    if combined_key in SUBCATEGORY_FLOORS:
        config = SUBCATEGORY_FLOORS[combined_key]
    elif cat_lower in SUBCATEGORY_FLOORS:
        config = SUBCATEGORY_FLOORS[cat_lower]
    else:
        for key, val in CATEGORY_FLOORS.items():
            if key in cat_lower or cat_lower in key:
                config = val
                break

    if not config:
        config = {
            "floor": 1000,
            "cutoff": 500,
            "fallback": f"No products are available at this budget for {category}.",
            "adjacent": "refurbished/pre-owned alternatives"
        }

    if budget < config["cutoff"]:
        next_steps = [
            f"Would you like to explore options near the starting floor price of ₹{config['floor']:,}?",
            f"You can also consider refurbished/pre-owned alternatives or adjacent product categories (such as {config['adjacent']})."
        ]
        return False, config["fallback"], next_steps, config["floor"], config["cutoff"]

    return True, None, None, config["floor"], config["cutoff"]

MODEL_FALLBACKS = [
    os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
    os.getenv("GEMINI_FALLBACK_MODEL", "gemini-2.5-flash-lite"),
    "gemini-flash-lite-latest",
    "gemini-flash-latest",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
]

@app.post("/api/recommend", response_model=RecommendationResponse)
def get_recommendations(req: RecommendationRequest):
    is_valid, fallback_msg, next_steps, floor_price, cutoff_price = validate_budget(req.category, req.budget, req.use_case)
    if not is_valid:
        return RecommendationResponse(
            recommendations=[],
            fallback_message=fallback_msg,
            next_steps=next_steps,
            floor_price=floor_price,
            cutoff_price=cutoff_price
        )

    prompt = f"""
    You are the recommendation core for PickMyTech in India.
    CRITICAL RULE: Evaluate the user's budget against the absolute floor price for {req.category}.
    If the user's budget (₹{req.budget}) is less than 50% of the lowest available starting price for that category (cutoff: ₹{cutoff_price}), do NOT list, invent, or suggest any products. Return an empty recommendations array.

    Otherwise, select the top 3 best {req.category} currently available in the Indian market that fit these criteria:
    - Budget limit: ₹{req.budget} INR (CRITICAL: Every product's estimated price MUST be less than or equal to ₹{req.budget} INR)
    - Primary Use Case: {req.use_case}
    - Brand Preference: {req.brand_pref}

    Ensure exact product names, realistic market prices in INR, and key specifications.
    """
    
    last_exception = None
    for model_name in MODEL_FALLBACKS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=RecommendationResponse,
                    temperature=0.2
                )
            )
            result = response.parsed
            if result:
                return result
        except Exception as e:
            last_exception = e
            continue

    raise HTTPException(status_code=500, detail=str(last_exception))
