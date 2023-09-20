import React, { useRef, useState } from "react";
import { Input, Table, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import search from "../assets/search.svg";
import { parse } from "papaparse";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./styles.css";
const { Search } = Input;
const { Option } = Select;

const TransactionSearch = ({
  transactions,
  exportToCsv,
  addTransaction,
  fetchTransactions,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const fileInput = useRef();
  const [activeSortButton, setActiveSortButton] = useState('');

  // Function to handle sorting when a button is clicked
  const handleSort = (key) => {
    setSortKey(key);
    setActiveSortButton(key);
  };

  function importFromCsv(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          // Now results.data is an array of objects representing your CSV rows
          for (const transaction of results.data) {
            // Write each transaction to Firebase, you can use the addTransaction function here
            console.log("Transactions", transaction);
            const newTransaction = {
              ...transaction,
              amount: parseInt(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All Transactions Added");
      fetchTransactions();
      event.target.files = null;
    } catch (e) {
      toast.error(e.message);
    }
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const searchMatch = searchTerm
      ? transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const tagMatch = selectedTag ? transaction.tag === selectedTag : true;
    const typeMatch = typeFilter ? transaction.type === typeFilter : true;

    return searchMatch && tagMatch && typeMatch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } 
    else if (sortKey === "amount") {
      return a.amount - b.amount;
    } 
    else {
      return 0;
    }
  });

  const dataSource = sortedTransactions.map((transaction, index) => ({
    key: index,
    ...transaction,
  }));

  return (
    <div className="container">
      <div className="main">
        <div className="input-flex">
          <img src={search} width="16" />
          <input  placeholder="Search by Name" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <Select style={{backgroundColor: "white"}} className="select-input" onChange={(value) => setTypeFilter(value)} value={typeFilter} placeholder="Filter" allowClear>
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>

      <div className="my-table">
      <h2 className="transaction">My Transactions</h2>

        <div className="table-content">
            <div className="input-radio">
              <div className="btn-coll">
                <button className={`sorting left ${activeSortButton === '' ? 'active' : ''}`}
                  onClick={() => handleSort('')}> No Sort
                </button>
                <button className={`sorting ${activeSortButton === 'date' ? 'active' : ''}`}
                  onClick={() => handleSort('date')} > By Date
                </button>
                <button className={`sorting right ${activeSortButton === 'amount' ? 'active' : ''}`}
                  onClick={() => handleSort('amount')} > By Amount
                </button>
              </div>
            </div>
            
            <div className="table-items">
                  <button className="btn" onClick={exportToCsv}>
                    Export CSV
                  </button>
                  <label for="file-csv" className="btn btn-blue">
                    Import CSV
                  </label>
                  
                  <input onChange={importFromCsv} id="file-csv" type="file" accept=".csv" required style={{ display: "none" }} />
            </div>
        </div>

        <Table columns={columns} dataSource={dataSource} />
      </div>
    </div>
  );
};

export default TransactionSearch;
