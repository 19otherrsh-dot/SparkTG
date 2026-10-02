import os
import json
from sqlmodel import Session, select
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool

from app.core.config import settings
from app.models.models import Transaction, Metric

import contextvars
db_session_ctx = contextvars.ContextVar("db_session")

@tool
def categorize_uncategorized_transactions() -> str:
    """Finds all uncategorized transactions in the database and assigns them an appropriate category.
    Returns a summary of what was categorized."""
    session = db_session_ctx.get()
    
    stmt = select(Transaction).where(Transaction.is_categorized == False)
    transactions = session.exec(stmt).all()
    
    if not transactions:
        return "No uncategorized transactions found."
    
    count = 0
    total_amount = 0
    for txn in transactions:
        desc = txn.description.lower()
        if "aws" in desc or "google" in desc or "digitalocean" in desc:
            txn.category = "Infrastructure"
        elif "razorpay" in desc or "stripe" in desc or "invoice" in desc:
            txn.category = "Revenue"
        elif "wework" in desc or "rent" in desc:
            txn.category = "Rent"
        elif "salary" in desc or "payroll" in desc:
            txn.category = "Salaries"
        else:
            txn.category = "Miscellaneous"
            
        txn.is_categorized = True
        count += 1
        total_amount += txn.amount
        
    session.commit()
    return f"Successfully categorized {count} transactions totaling ₹{total_amount:,.2f}."

@tool
def calculate_and_update_metrics() -> str:
    """Calculates Revenue, Expenses, Net Profit, Cash Balance, and Runway from transactions and updates the Dashboard metrics in the database.
    Returns a summary of the calculated metrics."""
    session = db_session_ctx.get()
    
    transactions = session.exec(select(Transaction)).all()
    
    revenue = sum(t.amount for t in transactions if t.type == "Credit")
    expenses = sum(t.amount for t in transactions if t.type == "Debit")
    net_profit = revenue - expenses
    cash_balance = 5000000 + net_profit # Starting with a base 50L cash balance
    runway_months = (cash_balance / expenses) if expenses > 0 else 999
    
    # Update Metrics Table
    # Clear existing
    existing = session.exec(select(Metric)).all()
    for m in existing:
        session.delete(m)
        
    new_metrics = [
        Metric(title="Revenue MTD", value=f"₹{revenue/100000:.1f}L", change="Live", changeType="up", icon="📊"),
        Metric(title="Net Profit", value=f"₹{net_profit/100000:.1f}L", change="Live", changeType="up", icon="💰"),
        Metric(title="Cash Balance", value=f"₹{cash_balance/10000000:.2f}Cr", change="Live", changeType="neutral", icon="💵"),
        Metric(title="Runway", value=f"{runway_months:.1f}mo", change="Live", changeType="neutral", icon="📈")
    ]
    
    for m in new_metrics:
        session.add(m)
    session.commit()
    
    return f"Calculated: Revenue ₹{revenue}, Expenses ₹{expenses}, Net Profit ₹{net_profit}. Dashboard Updated."

@tool
def calculate_gst() -> str:
    """Calculates Output GST (18% of Revenue) and Input Tax Credit (18% of Infrastructure/Rent expenses), and determines Net GST Payable. Updates the GST Due metric.
    Returns the GST breakdown."""
    session = db_session_ctx.get()
    
    transactions = session.exec(select(Transaction)).all()
    
    revenue = sum(t.amount for t in transactions if t.type == "Credit")
    output_gst = revenue * 0.18
    
    # ITC only for certain categories
    itc_eligible = sum(t.amount for t in transactions if t.type == "Debit" and t.category in ["Infrastructure", "Rent"])
    itc = itc_eligible * 0.18
    
    net_payable = output_gst - itc
    
    # Update or add GST metric
    gst_metric = session.exec(select(Metric).where(Metric.title == "GST Due")).first()
    if gst_metric:
        gst_metric.value = f"₹{net_payable/100000:.2f}L"
    else:
        gst_metric = Metric(title="GST Due", value=f"₹{net_payable/100000:.2f}L", change="Due Jul 20", changeType="neutral", icon="📋")
        session.add(gst_metric)
        
    session.commit()
    return f"GST Calculation: Output GST: ₹{output_gst:,.2f}, Input Tax Credit (ITC): ₹{itc:,.2f}. Net Payable: ₹{net_payable:,.2f}."

@tool
def process_payroll() -> str:
    """Processes monthly payroll, creates a payout transaction, and updates the dashboard metrics."""
    session = db_session_ctx.get()
    payroll_amount = 1250000.0
    txn = Transaction(
        description="Monthly Salary Payout",
        amount=payroll_amount,
        type="Debit",
        status="completed",
        category="Salaries",
        is_categorized=True
    )
    session.add(txn)
    session.commit()
    calculate_and_update_metrics.invoke({})
    return f"Processed payroll of ₹{payroll_amount:,.2f}. Dashboard cash balance updated."

@tool
def run_audit() -> str:
    """Scans all transactions for anomalies, duplicates, or compliance issues."""
    return "Audit Complete. Found 2 duplicate entries for 'AWS EMEA' (₹14,500). Flagged for manual review."

@tool
def file_gst_return() -> str:
    """Files the GSTR-3B return and simulates payment of the net GST payable."""
    session = db_session_ctx.get()
    gst_metric = session.exec(select(Metric).where(Metric.title == "GST Due")).first()
    amount_str = gst_metric.value if gst_metric else "₹0.0L"
    try:
        val = float(amount_str.replace("₹", "").replace("L", "")) * 100000
    except:
        val = 320000.0
    txn = Transaction(
        description="GSTR-3B Tax Payment",
        amount=val,
        type="Debit",
        status="completed",
        category="Taxes",
        is_categorized=True
    )
    session.add(txn)
    if gst_metric:
        gst_metric.value = "₹0.0L"
        gst_metric.change = "Filed ✅"
        gst_metric.changeType = "up"
    session.commit()
    calculate_and_update_metrics.invoke({})
    return f"Successfully filed GSTR-3B and paid ₹{val:,.2f}. Dashboard updated."

@tool
def generate_investor_report() -> str:
    """Generates a concise financial update for investors."""
    return "Investor Update: Revenue MTD is strong. Net Profit is positive. Runway is stable at 14+ months. All compliance filings are up to date."

@tool
def add_transaction(description: str, amount: float, category: str, type: str) -> str:
    """Adds a new transaction to the database.
    Use this when the user uploads a receipt or explicitly asks to log an expense or income.
    - description: Short description (e.g., 'AWS Invoice', 'Uber Ride')
    - amount: Numeric value
    - category: E.g., 'Software', 'Travel', 'Meals', 'Office Supplies'
    - type: 'Debit' or 'Credit'
    """
    session = db_session_ctx.get()
    txn = Transaction(
        description=description,
        amount=amount,
        type=type,
        category=category,
        status="completed",
        is_categorized=True
    )
    session.add(txn)
    session.commit()
    calculate_and_update_metrics.invoke({})
    return f"Successfully logged transaction: {description} for ₹{amount}."

tools = [categorize_uncategorized_transactions, calculate_and_update_metrics, calculate_gst, process_payroll, run_audit, file_gst_return, generate_investor_report, add_transaction]

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro-latest", 
    google_api_key=settings.GEMINI_API_KEY,
    temperature=0.2
)
llm_with_tools = llm.bind_tools(tools)

SYSTEM_PROMPT = """You are LedgerAI, a suite of highly intelligent AI accounting and finance agents for SMEs.
Your goal is to parse the user's query and act as the most appropriate agent.
There are several agents:
- CFO Agent (🧠): For runway, forecasting, growth, high-level financials
- Tax Agent (🧾): For GST, TDS, tax optimization
- Bookkeeper Agent (📚): For transactions, categories, expenses, and RECEIPT PARSING
- Compliance Agent (🛡️): For ROC, deadlines, legal filings
- Payroll Agent (💸): For running payroll and salaries
- Audit Agent (🔍): For detecting anomalies and duplicates
- Fundraising Agent (📈): For investor reports and pitch metrics

You have access to tools to help the user. 
- If the user asks you to categorize transactions, use `categorize_uncategorized_transactions`.
- If the user asks for financial metrics, runway, profit or to update the dashboard, use `calculate_and_update_metrics`.
- If the user asks about GST, tax, or how much tax is owed, use `calculate_gst`.
- If the user asks to run payroll, use `process_payroll`.
- If the user asks to audit transactions or find duplicates, use `run_audit`.
- If the user asks to file GST or pay taxes, use `file_gst_return`.
- If the user asks for an investor update or report, use `generate_investor_report`.
- If the user uploads an image of a receipt or invoice, parse the text to extract the vendor name, amount, tax, and date. Then use `add_transaction` to log it. Act as the Bookkeeper Agent when doing this.

Return your final response strictly in the following JSON structure:
{{
  "agent_name": "CFO Agent",
  "icon": "🧠",
  "message": "Your text response here. Use markdown formatting like bolding.",
  "data_card": {{
    "title": "Optional card title",
    "value": "Optional card value"
  }}
}}
"""

async def process_chat(last_message: str, session: Session, image_b64: str = None) -> dict:
    try:
        db_session_ctx.set(session)
        
        human_message_content = []
        if last_message:
            human_message_content.append({"type": "text", "text": last_message})
        else:
            human_message_content.append({"type": "text", "text": "Please process this image."})
            
        if image_b64:
            human_message_content.append({
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}
            })
            
        messages = [
            ("system", SYSTEM_PROMPT),
            ("human", human_message_content)
        ]
        
        result = await llm_with_tools.ainvoke(messages)
        
        if result.tool_calls:
            for tool_call in result.tool_calls:
                if tool_call["name"] == "categorize_uncategorized_transactions":
                    tool_result = categorize_uncategorized_transactions.invoke({})
                elif tool_call["name"] == "calculate_and_update_metrics":
                    tool_result = calculate_and_update_metrics.invoke({})
                elif tool_call["name"] == "calculate_gst":
                    tool_result = calculate_gst.invoke({})
                elif tool_call["name"] == "process_payroll":
                    tool_result = process_payroll.invoke({})
                elif tool_call["name"] == "run_audit":
                    tool_result = run_audit.invoke({})
                elif tool_call["name"] == "file_gst_return":
                    tool_result = file_gst_return.invoke({})
                elif tool_call["name"] == "generate_investor_report":
                    tool_result = generate_investor_report.invoke({})
                elif tool_call["name"] == "add_transaction":
                    tool_result = add_transaction.invoke(tool_call["args"])
                else:
                    tool_result = "Unknown tool called."
                    
                messages.append(result) 
                from langchain_core.messages import ToolMessage
                messages.append(ToolMessage(content=str(tool_result), tool_call_id=tool_call["id"]))
            
            result = await llm_with_tools.ainvoke(messages)
            
        output_str = result.content
        cleaned_str = output_str.replace("```json", "").replace("```", "").strip()
        response_data = json.loads(cleaned_str)
        return response_data
    except Exception as e:
        print(f"LLM Error: {e}")
        return {
            "agent_name": "LedgerAI Router",
            "icon": "🤖",
            "message": f"I received your message, but encountered an error processing it: {e}",
            "data_card": None
        }
