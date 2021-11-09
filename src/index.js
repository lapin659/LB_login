import dayjs from "dayjs";
import "./styles.css";

const weekday = require("dayjs/plugin/weekday");
const weekOfYear = require("dayjs/plugin/weekOfYear");

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

document.getElementById("app").innerHTML = `  
<div class="calendar-month">
  <section class="calendar-month-header">
    <div
      id="selected-month"
      class="calendar-month-header-selected-month"
    ></div>
    <section class="calendar-month-header-selectors">
      <span id="previous-month-selector"><</span>
      <span id="present-month-selector"> Navigation </span>
      <span id="next-month-selector">></span>
    </section>
  </section>

  <ol
    id="days-of-week"
    class="day-of-week"
  /></ol>

  <ol
    id="calendar-days"
    class="days-grid"
  >
  </ol>
</div>
`;

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY = dayjs().format("YYYY-MM-DD");

const INITIAL_YEAR = dayjs().format("YYYY");
const INITIAL_MONTH = dayjs().format("M");

let selectedMonth = dayjs(new Date(INITIAL_YEAR, INITIAL_MONTH - 1, 1));
let currentMonthDays;
let previousMonthDays;
let nextMonthDays;

// select the calendar grid header element
const daysOfWeekElement = document.getElementById("days-of-week");

// loop through the array of weekdays
WEEKDAYS.forEach((weekday) => {
  // for each item in the array, make a list item element
  const weekDayElement = document.createElement("li");
  // append a child element inside the list item...
  daysOfWeekElement.appendChild(weekDayElement);
  // ...that contains the value in the array
  weekDayElement.innerText = weekday;
});

createCalendar();
initMonthSelectors();



function createCalendar(year = INITIAL_YEAR, month = INITIAL_MONTH) {
  const calendarDaysElement = document.getElementById("calendar-days");

  document.getElementById("selected-month").innerText = dayjs(
    new Date(year, month - 1)
  ).format("MMMM YYYY");

  removeAllDayElements(calendarDaysElement);

  currentMonthDays = createDaysForCurrentMonth(
    year,
    month,
    dayjs(`${year}-${month}-01`).daysInMonth()
  );

  previousMonthDays = createDaysForPreviousMonth(year, month);

  nextMonthDays = createDaysForNextMonth(year, month);

  const days = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];

  days.forEach((day) => {
    appendDay(day, calendarDaysElement);
  });
}



function appendDay(day, calendarDaysElement) {
  const dayElement = document.createElement("li");
  const testElement = document.createElement("td");
  const dayElementClassList = dayElement.classList;
  // generic calendar day class
  dayElementClassList.add("calendar-day");
  // container for day of month number 
  const dayOfMonthElement = document.createElement("span");
  // content
  dayOfMonthElement.innerText = day.dayOfMonth;
  testElement.innerHTML = `
  <!-- Button to open the modal login form -->
  <button onclick="document.getElementById('id01').style.display='block'" style="width: 20px; height: 20px; margin: 5px; padding: 1px;"> + </button>

  <!-- The Modal -->
  <div id="id01" class="modal">
  <span onclick="document.getElementById('id01').style.display='none'" class="close" title="Close Modal">&times;</span>
  
  <!-- Modal Content -->
  <form class="modal-content animate" action="">
    <div>
      <header>
        <h2> New Event </h2>
    </header>

    <form>
        <label for="title"><label class="labelText"><b>Title</b></label></label>
        <input type="text" id="title" name="title" maxlength="30">
        <br />
        
        <label for="from"><label class="labelText"><b>From</b></label></label>
        <input type="text" id="from" name="from">

        <label for="to"><label class="labelText"><b>To</b></label></label>
        <input type="text" id="to" name="to">
    </form>
    
    <br> <br />
    <p id="rcorners1">
        All Day
        <br> <label class="switch">
            <input type="checkbox">
            <span class="slider round"></span>
        </label>
    </p>

    <form action="" method="post">
        <label for="start"><label class="labelText"><b>Start</b></label></label>
        <input type="date" id="title" name="start">
        
        <label for="end"><label class="labelText"><b>End</b></label></label>
        <input type="date" id="from" name="end">
    </form>

    <form action="" method="post">
        <label for="description"><label class="labelText"><b>Description</b></label></label>
        <input type="textarea" id="description" name="description" maxlength="50">
    </form>
      <br>
      <br>

    <p id="rcorners1">
        Repeat
        <br> <label class="switch">
            <input type="checkbox">
            <span class="slider round"></span>
        </label>
    </p>

    <button class="button button1">Add</button>
    <button class="button button1">Cancel</button>

    </div>
    
  <script>
  // Get the modal
  var modal = document.getElementById('id01');
    
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
  </script>
  </div>
  `;
  dayElement.appendChild(dayOfMonthElement);
  dayElement.appendChild(testElement);
  calendarDaysElement.appendChild(dayElement);
  
  //btn.innerHTML = "+";
  //dayElement.appendChild(btn);

  // add an extra class to differentiate current month days from prev/next month days
  if (!day.isCurrentMonth) {
    dayElementClassList.add("calendar-day--not-current");
  }

  if (day.date === TODAY) {
    dayElementClassList.add("calendar-day--today");
  }
}



function removeAllDayElements(calendarDaysElement) {
  let first = calendarDaysElement.firstElementChild;

  while (first) {
    first.remove();
    first = calendarDaysElement.firstElementChild;
  }
}



function getNumberOfDaysInMonth(year, month) {
  return dayjs(`${year}-${month}-01`).daysInMonth();
}

function createDaysForCurrentMonth(year, month) {
  return [...Array(getNumberOfDaysInMonth(year, month))].map((day, index) => {
    return {
      date: dayjs(`${year}-${month}-${index + 1}`).format("YYYY-MM-DD"),
      dayOfMonth: index + 1,
      isCurrentMonth: true
    };
  });
}



function createDaysForPreviousMonth(year, month) {
  const firstDayOfTheMonthWeekday = getWeekday(currentMonthDays[0].date);

  const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, "month");

  // Cover first day of the month being sunday (firstDayOfTheMonthWeekday === 0)
  const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday
    ? firstDayOfTheMonthWeekday - 1
    : 6;

  const previousMonthLastMondayDayOfMonth = dayjs(currentMonthDays[0].date)
    .subtract(visibleNumberOfDaysFromPreviousMonth, "day")
    .date();

  return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((day, index) => {
    return {
      date: dayjs(
        `${previousMonth.year()}-${previousMonth.month() + 1}-${
          previousMonthLastMondayDayOfMonth + index
        }`
      ).format("YYYY-MM-DD"),
      dayOfMonth: previousMonthLastMondayDayOfMonth + index,
      isCurrentMonth: false
    };
  });
}



function createDaysForNextMonth(year, month) {
  const lastDayOfTheMonthWeekday = getWeekday(
    `${year}-${month}-${currentMonthDays.length}`
  );

  const nextMonth = dayjs(`${year}-${month}-01`).add(1, "month");

  const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday
    ? 7 - lastDayOfTheMonthWeekday
    : lastDayOfTheMonthWeekday;

  return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
    return {
      date: dayjs(
        `${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`
      ).format("YYYY-MM-DD"),
      dayOfMonth: index + 1,
      isCurrentMonth: false
    };
  });
}



function getWeekday(date) {
  return dayjs(date).weekday();
}



function initMonthSelectors() {
  document
    .getElementById("previous-month-selector")
    .addEventListener("click", function () {
      selectedMonth = dayjs(selectedMonth).subtract(1, "month");
      createCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
    });

  document
    .getElementById("present-month-selector")
    .addEventListener("click", function () {
      selectedMonth = dayjs(new Date(INITIAL_YEAR, INITIAL_MONTH - 1, 1));
      createCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
    });

  document
    .getElementById("next-month-selector")
    .addEventListener("click", function () {
      selectedMonth = dayjs(selectedMonth).add(1, "month");
      createCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
    });
}
