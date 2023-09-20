import React from "react";
import { Card, Row } from "antd";

function Cards({
  currentBalance,
  income,
  expenses,
  showExpenseModal,
  showIncomeModal,
  cardStyle,
  reset,
}) {
  return (
    <Row
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        justifyContent: "space-between",
      }}
    >
      <Card bordered={true} style={cardStyle} className="card">
        <h2>Current Balance</h2>
        <p>₹{currentBalance}</p>
        <div class="btnn btnn-blue" style={{ margin: 0 }} onClick={reset}>
          Reset Balance
        </div>
      </Card>

      <Card bordered={true} style={cardStyle} className="card">
        <h2>Total Income</h2>
        <p>₹{income}</p>
        <div class="btnn btnn-blue" style={{ margin: 0 }} onClick={showIncomeModal} >
          Add Income
        </div>
      </Card>

      <Card bordered={true} style={cardStyle} className="card">
        <h2>Total Expenses</h2>
        <p>₹{expenses}</p>
        <div className="btnn btnn-blue" onClick={showExpenseModal}>
          Add Expense
        </div>
      </Card>
    </Row>
  );
}

export default Cards;