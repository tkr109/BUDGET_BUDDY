import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  message,
  Button,
  DatePicker,
  Slider,
} from "antd";
import axios from "axios";
import Spinner from "../components/Spinner";
import moment from "moment";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Analytics from "../components/Analytics";
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAlltransaction] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [budgets, setBudgets] = useState({}); 

  const [form] = Form.useForm(); 

  const categories = [
    "salary",
    "tip",
    "project",
    "food",
    "movie",
    "bills",
    "medical",
    "fee",
    "tax",
  ];

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("DD-MM-YY")}</span>,
    },
    {
      title: "Amount(₹)",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: {
        showTitle: true, 
      },
    },
  {
  title: "Actions",
  render: (text, record) => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <EditOutlined
        onClick={() => {
          setEditable(record);
          setShowModal(true);
        }}
        style={{ marginRight: '25px' }} 
      />
      <DeleteOutlined
        className="mx-2 ml-4"
        onClick={() => {
          handleDelete(record);
        }}
      />
    </div>
  ),
}
  ];

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post('/api/v1/transaction/del-transaction', { transactionId: record._id });
      message.success("Transaction Deleted");
      setLoading(false);
      getAllTransaction(); 
    } catch (error) {
      setLoading(false);
      message.error("Error Deleting Transaction");
    }
  };

  const getAllTransaction = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      const res = await axios.post("api/v1/transaction/get-transaction", {
        userid: user._id,
        frequency,
        type,
      });
      setLoading(false);
      setAlltransaction(res.data);
    } catch (error) {
      setLoading(false);
      message.error("Transaction Can't be Fetched");
    }
  };

  const handleSubmit = async (value) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const categoryBudget = budgets[value.category] || 0; 
    const currentExpense = allTransaction.reduce((total, transaction) => {
      return total + (transaction.type === "expense" && transaction.category === value.category ? transaction.amount : 0);
    }, 0);

    const newTotalExpense = currentExpense + value.amount;

    
    if (value.type === "expense" && newTotalExpense > categoryBudget) {
      
      message.warning(`This expense exceeds your budget for ${value.category}. Current total: ${newTotalExpense}, Budget: ${categoryBudget}`);

      
      const shouldProceed = await new Promise((resolve) => {
        Modal.confirm({
          title: "Budget Exceeded",
          content: "This expense exceeds your budget. Do you want to proceed?",
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });

      if (!shouldProceed) return; 
    }

    try {
      setLoading(true);
      if (editable) {
        await axios.post("api/v1/transaction/edit-transaction", {
          payload: {
            ...value,
            userId: user._id,
          },
          transactionId: editable._id,
        });
        message.success("Transaction Updated Successfully");
      } else {
        await axios.post("api/v1/transaction/add-transaction", {
          ...value,
          userid: user._id,
        });
        message.success("Transaction Added");
      }
      setShowModal(false);
      setLoading(false);
      setEditable(null);
      getAllTransaction(); 
    } catch (error) {
      setLoading(false);
      message.error("Failed to add Transaction");
    }
  };

  const handleEmailSubmit = async (values) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [startDate, endDate] = values.dates;

    try {
      setLoading(true);
      await axios.post('/api/v1/email/send-summary', {
        userId: user._id,
        email: values.email,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      setLoading(false);
      message.success('Report email sent successfully');
      setEmailModalVisible(false);
    } catch (error) {
      setLoading(false);
      message.error('Failed to send report email');
    }
  };

  const calculateTotals = () => {
    let totalIncome = 0;
    let totalExpense = 0;

    allTransaction.forEach(transaction => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else if (transaction.type === "expense") {
        totalExpense += transaction.amount;
      }
    });

    return { totalIncome, totalExpense };
  };

  useEffect(() => {
    getAllTransaction();
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.budgets) {
      setBudgets(user.budgets);
    }
  }, [frequency, type]);

  useEffect(() => {
    if (editable) {
      form.setFieldsValue({
        ...editable,
        date: moment(editable.date),
      });
    } else {
      form.resetFields();
    }
  }, [editable, form]);

  const { totalIncome, totalExpense } = calculateTotals();

  const handleBudgetChange = (category, value) => {
    const updatedBudgets = { ...budgets, [category]: value };
    setBudgets(updatedBudgets);
 
    const user = JSON.parse(localStorage.getItem("user"));
    user.budgets = updatedBudgets;
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleBudgetSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      setLoading(true);
      await axios.post('/api/v1/users/update-budget', {
        userId: user._id,
        budgets,
      });
      setLoading(false);
      message.success('Budgets saved successfully');
      setBudgetModalVisible(false);
    } catch (error) {
      setLoading(false);
      message.error('Failed to save budgets');
    }
  };

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <Select value={frequency} onChange={(values) => setFrequency(values)}>
          <Select.Option value="7">LAST 1 Week</Select.Option>
          <Select.Option value="30">LAST 1 Month</Select.Option>
          <Select.Option value="365">LAST 1 Year</Select.Option>
        </Select>
        <Select value={type} onChange={(values) => setType(values)}>
          <Select.Option value="all">All</Select.Option>
          <Select.Option value="income">Income</Select.Option>
          <Select.Option value="expense">Expense</Select.Option>
        </Select>
        <div className="icon">
          <UnorderedListOutlined
            className={`mx-2 mb-1${viewData === "table" ? "active" : "inactive"}`}
            onClick={() => setViewData("table")}
          />
          <AreaChartOutlined
            className={`mx-2 mb-1 ${viewData === "table" ? "inactive" : "active"}`}
            onClick={() => setViewData("chart")}
          />
        </div>
        <div>
          <button
            className="btn btn-outline-dark btn-sm"
            onClick={() => {
              setEditable(null);
              setShowModal(true);
            }}
          >
            Add New
          </button>
        </div>
      </div>

      <div className="content">
        <div className="totals">
          <div className="left">
          <div className="inc">Total Income: <span style={{ fontWeight: 'bold' }}>₹{totalIncome}</span></div>
            <div className="exp">Total Expenses: <span style={{ fontWeight: 'bold' }}>₹{totalExpense}</span></div>
          </div>
          <div className="right">
            <button className="btn btn-outline-dark btn-sm" onClick={() => setEmailModalVisible(true)}>Share Report</button>
            <button className="btn btn-outline-dark btn-sm" onClick={() => setBudgetModalVisible(true)}>Create Budget</button>
          </div>
        </div>

        {viewData === "table" ? (
          <Table columns={columns} dataSource={allTransaction} />
        ) : (
          <Analytics allTransaction={allTransaction} />
        )}
      </div>

      <Modal
        title={editable ? "Edit Transaction" : "Add Transaction"}
        open={showModal}
        onCancel={() => {
          setShowModal(false);
          setEditable(null); 
        }}
        footer={false}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          form={form} 
        >
          <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Please input the amount' }]}>
            <Input type="number" min={0}/>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Please select the type' }]}>
                <Select>
                  <Select.Option value="income">Income</Select.Option>
                  <Select.Option value="expense">Expense</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please select a category' }]}>
                <Select>
                  {categories.map((category) => (
                    <Select.Option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Please select the date' }]}>
            <Input type="date" />
          </Form.Item>
          
          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-outline-dark btn-sm">
              Save
            </button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Send Transaction Report"
        visible={emailModalVisible}
        onCancel={() => setEmailModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleEmailSubmit}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input the email address' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Date Range"
            name="dates"
            rules={[{ required: true, message: 'Please select the date range' }]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <button htmlType="submit" className="btn btn-outline-dark mt-3">
              Send Report
            </button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Set Budget"
        visible={budgetModalVisible}
        onCancel={() => setBudgetModalVisible(false)}
        footer={[
          <button key="back" className="btn btn-outline-dark btn-sm" onClick={() => setBudgetModalVisible(false)}>
            Cancel
          </button>,
          <button key="submit" className="btn btn-outline-dark btn-sm mx-3 mr-0" onClick={handleBudgetSubmit}>
            Save Budget
          </button>,
        ]}
      >
        <Row gutter={16}>
          {categories.map((category) => (
            <Col span={24} key={category} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100px' }}>{category}</div>
              <Slider
                min={0}
                max={50000}
                step={1000}
                value={budgets[category] || 0}
                onChange={(value) => handleBudgetChange(category, value)}
                handleStyle={{
                  borderColor: 'black',
                  backgroundColor: 'black',
                }}
                trackStyle={{
                  backgroundColor: 'black',
                }}
                railStyle={{
                  backgroundColor: 'lightgrey',
                }}
                dotActiveBorderColor="black"
                dotBorderColor="black"
                style={{ flexGrow: 1, margin: '0 10px' }}
              />
              <Input
                type="number"
                value={budgets[category] || 0}
                onChange={(e) => handleBudgetChange(category, parseFloat(e.target.value))}
                style={{ width: '80px' }}
              />
            </Col>
          ))}
        </Row>
      </Modal>
    </Layout>
  );
};

export default HomePage;
