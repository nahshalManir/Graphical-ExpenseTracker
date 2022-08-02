"use strict";

const openModal = document.getElementById("open--modal");
const closeModal = document.getElementById("close--modal");
const modalContent = document.querySelector(".modal--content");
const transactionForm = document.getElementById("transaction--form");
const overlay = document.querySelector(".overlay");
const body = document.querySelector("body");
const datePicker = document.getElementById("date-picker");
const form = document.getElementById("form");
const incomeForm = document.getElementById("income--form");
const expenseForm = document.getElementById("expense--form");
const incomeTags = document.getElementById("income--tags");
const expenseTags = document.getElementById("expense--tags");
const tags = document.getElementById("tags");
const transactionsList = document.querySelector(".transactions--list");
const table = document.getElementById("transaction--table");
const dateHead = document.getElementById("date--head");
const valueHead = document.getElementById("value--head");
const incomeCard = document.querySelector(".income-card");
const expenseCard = document.querySelector(".expense-card");
const savingsCard = document.querySelector(".savings-card");
const lineGraph = document.getElementById("line-graph");
const pieChart = document.getElementById("myChart");
const showMonth = document.getElementById("select--month");
const tagType = document.getElementById("tag--type");

if (window.outerWidth >= 640) {
  Chart.defaults.font.size = 12;
}
if (window.outerWidth < 640) {
  Chart.defaults.font.size = 10;
}

const dailyTransactionsGraph = new Chart(lineGraph, {
  type: "line",
  data: {
    datasets: [
      {
        label: "Income",
        backgroundColor: "rgba(0, 255, 0, 0.5)",
        borderColor: "rgba(0, 255, 0)",
        borderWidth: 1.5,
        data: [],
        pointStyle: "circle",
        pointRadius: 3.5,
        pointHoverRadius: 6,
        borderWidth: 3,
      },
      {
        label: "Expense",
        backgroundColor: "rgba(255, 99, 132, 0.8)",
        borderColor: "rgba(255, 99, 132)",
        borderWidth: 1.5,
        data: [],
        pointStyle: "circle",
        pointRadius: 3.5,
        pointHoverRadius: 6,
        borderWidth: 3,
      },
    ],
  },
  options: {
    animation: {
      easing: "easeInOutCubic",
      duration: 1250,
    },
    responsive: true,
    maintainAspectRatio: false,
    tension: 0.4,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        parsing: false,
        type: "time",
        time: {
          unit: "day",
        },
      },
      y: {
        grid: {
          display: false,
        },
        beginAtZero: true,
      },
    },
  },
});

const tagChart = new Chart(pieChart, {
  type: "pie",
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1.5,
        borderJoinStyle: "bevel",
        spacing: 1,
      },
    ],
  },
  options: {
    animation: {
      easing: "easeOutBounce",
      duration: 1250,
    },
    responsive: true,
    maintainAspectRatio: false,
    hoverOffset: 20,
    layout: {
      padding: {
        top: 20,
        bottom: 20,
      },
    },
    plugins: {
      datalabels: {
        color: "black",
        align: "center",
        formatter: (value, context) => {
          if (tagChart.data.labels.length == 0) return [];
          const datapoints = tagChart.isDatasetVisible(0)
            ? context.chart.data.datasets[0].data
            : context.chart.data.datasets[1].data;
          const totalSum = (total, datapoint) => total + datapoint;
          const totalValue = datapoints.reduce(totalSum, 0);
          const percentageValue = ((value / totalValue) * 100).toFixed(1);
          const display = [`${percentageValue}%`];
          return display;
        },
      },
      legend: {
        position: "bottom",
        display: true,
        labels: {
          usePointStyle: true,
          padding: 14,
          boxWidth: 15,
        },
      },
    },
    maintainAspectRation: false,
    elements: {
      arc: {
        borderAlign: "inner",
      },
    },
  },
  plugins: [ChartDataLabels],
});

const tagChartColor = {
  income: {
    backgroundColor: [
      "rgba(128, 237, 153, 0.7)",
      "rgba(87, 204, 153, 0.7)",
      "rgba(56, 163, 165, 0.7)",
      "rgba(34, 87, 122, 0.7)",
    ],
    borderColor: [
      "rgba(128, 237, 153)",
      "rgba(87, 204, 153)",
      "rgba(56, 163, 165)",
      "rgba(34, 87, 122)",
    ]
  },
  expense: {
    backgroundColor: [
      "rgba(38, 70, 83, 0.7)",
      "rgba(42, 157, 143, 0.7)",
      "rgba(233, 196, 106, 0.7)",
      "rgba(244, 162, 97, 0.7)",
      "rgba(231, 111, 81, 0.7)",
      "rgba(53, 80, 112, 0.7)",
      "rgba(109, 89, 122, 0.7)",
      "rgba(181, 101, 118, 0.7)",
      "rgba(229, 107, 111, 0.7)",
      "rgba(234, 172, 139, 0.7)",
      "rgba(227, 100, 20, 0.7)",
      "rgba(15, 76, 92, 0.7)",
    ],
    borderColor: [
      "rgba(38, 70, 83)",
      "rgba(42, 157, 143)",
      "rgba(233, 196, 106)",
      "rgba(244, 162, 97)",
      "rgba(231, 111, 81)",
      "rgba(53, 80, 112)",
      "rgba(109, 89, 122)",
      "rgba(181, 101, 118)",
      "rgba(229, 107, 111)",
      "rgba(234, 172, 139)",
      "rgba(227, 100, 20)",
      "rgba(15, 76, 92)",
    ],
  }
};

const responsiveFonts = () => {
  if (window.outerWidth >= 640) {
    Chart.defaults.font.size = 12;
  }
  if (window.outerWidth < 640) {
    Chart.defaults.font.size = 10;
  }
  dailyTransactionsGraph.update();
  tagChart.update();
};

window.addEventListener("resize", responsiveFonts);

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

incomeForm.addEventListener("click", () => {
  incomeTags.classList.remove("hidden");
  incomeTags.classList.add("active--tag");
  expenseTags.classList.add("hidden");
  expenseTags.classList.remove("active--tag");
  incomeForm.classList.add("bg-gray-100");
  expenseForm.classList.remove("bg-gray-100");
});
expenseForm.addEventListener("click", () => {
  expenseTags.classList.remove("hidden");
  expenseTags.classList.add("active--tag");
  incomeTags.classList.add("hidden");
  incomeTags.classList.remove("active--tag");
  expenseForm.classList.add("bg-gray-100");
  incomeForm.classList.remove("bg-gray-100");
});

class ExpenseTracker {
  monthlyIncome = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  monthlyExpense = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  monthlySavings = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  incomeSplit = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  expenseSplit = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  transactions = [[], [], [], [], [], [], [], [], [], [], [], []];
  dailyExpenseTotals = [[], [], [], [], [], [], [], [], [], [], [], []];
  dailyIncomeTotals = [[], [], [], [], [], [], [], [], [], [], [], []];
  currentMonth = new Date().getMonth();

  constructor() {
    // Initialize components
    this.getLocalStorage();
    showMonth.value = this.currentMonth;

    // Attach event handlers
    form.addEventListener("submit", this.submitForm.bind(this));
    openModal.addEventListener("click", this.showForm);
    closeModal.addEventListener("click", this.hideForm);
    showMonth.addEventListener("change", this.changeMonthView.bind(this));
    tagType.addEventListener("change", this.updateTagChart.bind(this));
    dateHead.addEventListener("click", this.sortTable.bind(null, 1));
    valueHead.addEventListener("click", this.sortTable.bind(null, 2));
  }

  changeMonthView(e) {
    const month = Number(e.target.value);
    this.currentMonth = month;
    const renderType = "refresh";
    transactionsList.textContent = "";

    this.transactions[month].forEach((data) => {
      this.renderTransaction(data, month, data.date, renderType);
    });
    this.updateCards(month);
    this.updateCharts(month);
  }

  showForm() {
    transactionForm.classList.remove("hidden");
    overlay.classList.remove("hidden");
    setTimeout(() => {
      modalContent.classList.remove("-translate-y-full");
      overlay.classList.remove("opacity-0");
      overlay.classList.add("opacity-40");
    }, 1);
    body.classList.add("overflow-hidden");
  }

  hideForm() {
    setTimeout(() => {
      transactionForm.classList.add("hidden");
      overlay.classList.add("hidden");
    }, 600);
    setTimeout(() => {
      modalContent.classList.add("-translate-y-full");
      overlay.classList.remove("opacity-40");
      overlay.classList.add("opacity-0");
    }, 100);
    body.classList.remove("overflow-hidden");
  }

  submitForm(e) {
    e.preventDefault();
    const date = datePicker.value;
    const tag = document.querySelector(".active--tag").value;
    const description = document.querySelector("#description").value;
    const value = Number(document.querySelector("#value").value);
    const type = document.querySelector(".active--tag").dataset.type;

    const id = String(Date.now()).slice(-10);
    this.addTransaction(id, date, tag, description, value, type);
    this.hideForm();

    document.querySelector("#description").value = "";
    document.querySelector("#value").value = "";
  }

  addTransaction(id, date, tag, description, value, type) {
    const curYear = date.slice(0, 4);
    const monthNum = Number(date.slice(5, 7)) - 1;
    const curMonth = monthNames[monthNum];
    const curDate = date.slice(8);
    const displayDate = curDate + "-" + curMonth + "-" + curYear;

    const currentTransaction = {
      id: id,
      date: date,
      value: value,
      description: description,
      tag: tag,
      type: type,
    };
    this.transactions[Number(date.slice(5, 7)) - 1].push(currentTransaction);

    if (monthNum === this.currentMonth) {
      const renderType = "newTransaction";
      this.renderTransaction(currentTransaction, monthNum, date, renderType);
    }
    this.updateMonthlyTotals(monthNum, currentTransaction);
    this.updateDailyTotals(currentTransaction, monthNum);
    if (monthNum === this.currentMonth) {
      this.updateCards(monthNum);
      this.updateCharts(monthNum);
    }

    this.setLocalStorage();
  }

  renderTransaction(transaction, monthNum, date, renderType) {
    const curYear = date.slice(0, 4);
    const curMonth = monthNames[monthNum];
    const curDate = date.slice(8);
    const displayDate = curDate + "-" + curMonth + "-" + curYear;

    let border, highlight, sign;
    if (transaction.type == "expense") {
      border = "border-red-500";
      highlight = "text-red-500";
      sign = "- &#x20B9";
    } else if (transaction.type === "income") {
      border = "border-green-500";
      highlight = "text-green-500";
      sign = "+ &#x20B9";
    }

    const newTransaction = document.createElement("tr");
    newTransaction.classList.add(
      "border-b",
      "odd:bg-white",
      "even:bg-gray-50",
      "whitespace-nowrap",
      "opacity-0",
      "transition-opacity",
      "duration-500",
      "h-10"
    );
    newTransaction.setAttribute("data-date", Number(curDate));
    newTransaction.setAttribute("data-value", transaction.value);

    newTransaction.innerHTML = `<td scope="row" class="px-1 md:px-3 py-4 font-medium text-gray-900 text-xs border-l-4 ${border} border-opacity-90">
    <p class="md:text-base">${transaction.description}</p>
    <p class="text-gray-600">${transaction.tag}</p>
    </td>
    <td class="min-w-[72px] w-1/5 md:w-24 py-4 text-xs text-left md:text-base font-semibold  text-gray-900">
    	${displayDate}
    </td>
    <td class="min-w-[88px] w-1/5 py-4 pr-1 text-right text-xs md:text-base font-bold ${highlight}">
    	${sign};${transaction.value}
    </td>`;
    setTimeout(() => {
      newTransaction.classList.add("opacity-100");
    }, 1);
    newTransaction.setAttribute("id", transaction.id);

    const deleteBtn = document.createElement("td");
    const deleteBtnContainer = document.createElement("button");
    deleteBtnContainer.addEventListener(
      "click",
      this.deleteTransaction.bind(this, monthNum)
    );
    deleteBtnContainer.classList.add(
      "w-4",
      "h-4",
      "sm:w-5",
      "sm:h-5",
      "cursor-pointer",
      "mx-1",
      "sm:mx-2"
    );
    deleteBtnContainer.innerHTML = `<svg data-id=${transaction.id} class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path data-id=${transaction.id} fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg> 
    `;
    deleteBtn.appendChild(deleteBtnContainer);
    deleteBtn.classList.add(
      "delete--transaction",
      "w-4",
      "h-4",
      "sm:w-5",
      "sm:h-5"
    );
    deleteBtn.setAttribute("data-id", transaction.id);

    newTransaction.appendChild(deleteBtn);
    transactionsList.prepend(newTransaction);
  }

  updateMonthlyTotals(month, transaction) {
    if (transaction.type === "expense")
      this.monthlyExpense[month] += transaction.value;
    else this.monthlyIncome[month] += transaction.value;
    this.monthlySavings[month] =
      this.monthlyIncome[month] - this.monthlyExpense[month];
  }

  updateDailyTotals(transaction, monthNum) {
    const curDate = transaction.date.slice(8);
    if (transaction.type === "expense") {
      if (!this.dailyExpenseTotals[monthNum][Number(curDate) - 1]) {
        this.dailyExpenseTotals[monthNum][Number(curDate) - 1] = {
          x: transaction.date,
          y: transaction.value,
        };
      } else {
        this.dailyExpenseTotals[monthNum][Number(curDate) - 1].y +=
          transaction.value;
      }

      if (!this.expenseSplit[monthNum].tag) {
        this.expenseSplit[monthNum].tag = [];
        this.expenseSplit[monthNum].value = [];
      }

      const index = this.expenseSplit[monthNum].tag.findIndex(
        (tag) => tag === transaction.tag
      );
      if (index == -1) {
        this.expenseSplit[monthNum].tag.push(transaction.tag);
        this.expenseSplit[monthNum].value.push(transaction.value);
      } else this.expenseSplit[monthNum].value[index] += transaction.value;
    } else {
      if (!this.dailyIncomeTotals[monthNum][Number(curDate) - 1]) {
        this.dailyIncomeTotals[monthNum][Number(curDate) - 1] = {
          x: transaction.date,
          y: transaction.value,
        };
      } else {
        this.dailyIncomeTotals[monthNum][Number(curDate) - 1].y +=
          transaction.value;
      }

      if (!this.incomeSplit[monthNum].tag) {
        this.incomeSplit[monthNum].tag = [];
        this.incomeSplit[monthNum].value = [];
      }

      const index = this.incomeSplit[monthNum].tag.findIndex(
        (tag) => tag === transaction.tag
      );
      if (index == -1) {
        this.incomeSplit[monthNum].tag.push(transaction.tag);
        this.incomeSplit[monthNum].value.push(transaction.value);
      } else this.incomeSplit[monthNum].value[index] += transaction.value;
    }
  }

  updateCharts(monthNum) {
    const expenseData = this.dailyExpenseTotals[monthNum].filter(
      (data) => data != null
    );
    const incomeData = this.dailyIncomeTotals[monthNum].filter(
      (data) => data != null
    );

    dailyTransactionsGraph.data.datasets[0].data = incomeData;
    dailyTransactionsGraph.data.datasets[1].data = expenseData;
    dailyTransactionsGraph.update();

    if (tagType.value === "expense") {
      tagChart.data.labels =
        Object.keys(this.expenseSplit[monthNum]).length == 0
          ? []
          : this.expenseSplit[monthNum].tag;
      tagChart.data.datasets[0].data =
        this.expenseSplit[monthNum].value == undefined
          ? []
          : this.expenseSplit[monthNum].value;
      tagChart.data.datasets[0].backgroundColor = tagChartColor.expense.backgroundColor;
      tagChart.data.datasets[0].borderColor = tagChartColor.expense.borderColor;
    } else {
      tagChart.data.labels =
        Object.keys(this.incomeSplit[monthNum]).length == 0
          ? []
          : this.incomeSplit[monthNum].tag;
      tagChart.data.datasets[0].data =
        this.incomeSplit[monthNum].value == undefined
          ? []
          : this.incomeSplit[monthNum].value;
      tagChart.data.datasets[0].backgroundColor = tagChartColor.income.backgroundColor;
      tagChart.data.datasets[0].borderColor = tagChartColor.income.borderColor;
    }

    tagChart.update();
    console.log(tagChart.data);
  }

  updateTagChart(e) {
    if (e.target.value === "income") {
      tagChart.data.datasets[0].data =
        this.incomeSplit[this.currentMonth].value == undefined
          ? []
          : this.incomeSplit[this.currentMonth].value;
      tagChart.data.labels =
        Object.keys(this.incomeSplit[this.currentMonth]).length === 0
          ? []
          : this.incomeSplit[this.currentMonth].tag;
      tagChart.data.datasets[0].backgroundColor = tagChartColor.income.backgroundColor;
      tagChart.data.datasets[0].borderColor = tagChartColor.income.borderColor;
    } else {
      tagChart.data.datasets[0].data =
        this.expenseSplit[(this, this.currentMonth)].value == undefined
          ? []
          : this.expenseSplit[(this, this.currentMonth)].value;
      tagChart.data.labels =
        Object.keys(this.expenseSplit[this.currentMonth]).length === 0
          ? []
          : this.expenseSplit[this.currentMonth].tag;
      tagChart.data.datasets[0].backgroundColor = tagChartColor.expense.backgroundColor;
      tagChart.data.datasets[0].borderColor = tagChartColor.expense.borderColor;
    }

    tagChart.update();
  }

  updateCards(month) {
    incomeCard.textContent = `${this.monthlyIncome[month]}`;
    expenseCard.textContent = `${this.monthlyExpense[month]}`;
    savingsCard.textContent = `${this.monthlySavings[month]}`;
  }

  deleteTransaction(month, e) {
    const transactionEl = document.getElementById(e.target.dataset.id);

    const index = this.transactions[month].findIndex(
      (data) => data.id === e.target.dataset.id
    );
    const getTransaction = this.transactions[month][index];
    this.transactions[month] = this.transactions[month].filter(
      (data) => data.id != getTransaction.id
    );

    const type = getTransaction.type;
    const value = getTransaction.value;
    const curDate = getTransaction.date.slice(8);
    const tag = getTransaction.tag;
    if (type === "income") {
      this.dailyIncomeTotals[month][Number(curDate) - 1].y -= value;
      if (!this.dailyIncomeTotals[month][Number(curDate) - 1].y)
        this.dailyIncomeTotals[month].splice(Number(curDate) - 1, 1);
      this.monthlyIncome[month] -= value;
      const index = this.incomeSplit[month].tag.findIndex(
        (data) => data === tag
      );
      this.incomeSplit[month].value[index] -= value;
      if (this.incomeSplit[month].value[index] == 0) {
        this.incomeSplit[month].tag.splice(index, 1);
        this.incomeSplit[month].value.splice(index, 1);
      }
    } else {
      this.dailyExpenseTotals[month][Number(curDate) - 1].y -= value;
      if (!this.dailyExpenseTotals[month][Number(curDate) - 1].y)
        this.dailyExpenseTotals[month].splice(Number(curDate) - 1, 1);
      this.monthlyExpense[month] -= value;
      const index = this.expenseSplit[month].tag.findIndex(
        (data) => data === tag
      );
      this.expenseSplit[month].value[index] -= value;
      if (this.expenseSplit[month].value[index] == 0) {
        this.expenseSplit[month].tag.splice(index, 1);
        this.expenseSplit[month].value.splice(index, 1);
      }
    }
    this.monthlySavings[month] =
      this.monthlyIncome[month] - this.monthlyExpense[month];
    transactionEl.remove();
    this.updateCards(month);
    this.updateCharts(month);
    this.setLocalStorage();
  }

  sortTable(n) {
    let rows = 0,
      switching = 0,
      i = 0,
      x = 0,
      y = 0,
      shouldSwitch = 0,
      dir = 0,
      switchcount = 0;

    switching = true;
    dir = "asc";
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("td")[n];
        y = rows[i + 1].getElementsByTagName("td")[n];
        let xVal = n == 1 ? x.innerHTML : Number(x.innerHTML.substring(9));
        let yVal = n == 1 ? y.innerHTML : Number(y.innerHTML.substring(9));
        if (dir == "asc") {
          if (xVal > yVal) {
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (xVal < yVal) {
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount++;
      } else {
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

  setLocalStorage() {
    localStorage.setItem("monthlyIncome", JSON.stringify(this.monthlyIncome));
    localStorage.setItem("monthlyExpense", JSON.stringify(this.monthlyExpense));
    localStorage.setItem("monthlySavings", JSON.stringify(this.monthlySavings));
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
    localStorage.setItem(
      "dailyIncomeTotals",
      JSON.stringify(this.dailyIncomeTotals)
    );
    localStorage.setItem(
      "dailyExpenseTotals",
      JSON.stringify(this.dailyExpenseTotals)
    );
    localStorage.setItem("incomeSplit", JSON.stringify(this.incomeSplit));
    localStorage.setItem("expenseSplit", JSON.stringify(this.expenseSplit));
  }

  getLocalStorage() {
    const incomeData = JSON.parse(localStorage.getItem("monthlyIncome"));
    const expenseData = JSON.parse(localStorage.getItem("monthlyExpense"));
    const savingsData = JSON.parse(localStorage.getItem("monthlySavings"));
    const incomeSplitData = JSON.parse(localStorage.getItem("incomeSplit"));
    const expenseSplitData = JSON.parse(localStorage.getItem("expenseSplit"));
    const dailyIncomeData = JSON.parse(
      localStorage.getItem("dailyIncomeTotals")
    );
    const dailyExpenseData = JSON.parse(
      localStorage.getItem("dailyExpenseTotals")
    );
    const transactionData = JSON.parse(localStorage.getItem("transactions"));

    if (!transactionData) return;
    this.dailyIncomeTotals = dailyIncomeData;
    this.dailyExpenseTotals = dailyExpenseData;
    this.monthlyIncome = incomeData;
    this.monthlyExpense = expenseData;
    this.monthlySavings = savingsData;
    this.transactions = transactionData;
    this.incomeSplit = incomeSplitData;
    this.expenseSplit = expenseSplitData;
    const month = new Date().getMonth();
    this.currentMonth = month;
    const renderType = "localStorage";
    this.transactions[month].forEach((data) => {
      this.renderTransaction(data, month, data.date, renderType);
    });
    this.updateCards(month);
    if (month === this.currentMonth) this.updateCharts(month);
  }
}
const ET = new ExpenseTracker();
