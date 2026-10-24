import { useEffect, useState } from "react";
import "./styles.css";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getMonthName(monthNum: number): string {
  return MONTHS[monthNum - 1];
}

interface AgeResult {
  years: number;
  months: number;
  days: number;
}

export default function App() {
  const [theme, setTheme] = useState<string>(() => localStorage.getItem("theme") || "light");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [dayError, setDayError] = useState("");
  const [monthError, setMonthError] = useState("");
  const [yearError, setYearError] = useState("");
  const [result, setResult] = useState<AgeResult | null>(null);

  // The original stylesheet styles body.theme-* — apply the class to <body>.
  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-mode" : "light-mode";
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  const handleDay = (value: string) => {
    let v = value.replace(/[^0-9]/g, "");
    const parsed = parseInt(v);
    if (parsed > 31) v = "31";
    setDay(v);
  };

  const handleMonth = (value: string) => {
    let v = value.replace(/[^0-9]/g, "");
    const parsed = parseInt(v);
    if (parsed > 12) v = "12";
    setMonth(v);
  };

  const handleYear = (value: string) => {
    let v = value.replace(/[^0-9]/g, "");
    const currentYear = new Date().getFullYear();
    const parsed = parseInt(v);
    if (parsed > currentYear) v = currentYear.toString();
    setYear(v);
  };

  const calculateAge = () => {
    setDayError("");
    setMonthError("");
    setYearError("");

    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);

    let hasError = false;

    if (!day) {
      setDayError("Day is required");
      hasError = true;
    } else if (d < 1 || d > 31) {
      setDayError("Must be a valid day");
      hasError = true;
    }

    if (!month) {
      setMonthError("Month is required");
      hasError = true;
    } else if (m < 1 || m > 12) {
      setMonthError("Must be a valid month");
      hasError = true;
    }

    if (!year) {
      setYearError("Year is required");
      hasError = true;
    } else if (year.length < 4) {
      setYearError("Year must be 4 digits");
      hasError = true;
    }

    if (d && m && !hasError) {
      const monthDays = [
        31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30,
        31, 31, 30, 31, 30, 31,
      ];
      if (d > monthDays[m - 1]) {
        setDayError(`Invalid day for ${getMonthName(m)}`);
        hasError = true;
      }
    }

    const currentDate = new Date();
    const birthDate = new Date(y, m - 1, d);

    if (birthDate > currentDate && !hasError) {
      setYearError("Date cannot be in the future");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    let years: number, months: number, days: number;
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    years = currentYear - y;

    if (currentMonth >= m) {
      months = currentMonth - m;
    } else {
      years--;
      months = 12 + currentMonth - m;
    }

    if (currentDay >= d) {
      days = currentDay - d;
    } else {
      months--;
      const monthDays = [
        31, isLeapYear(currentYear) ? 29 : 28, 31, 30, 31, 30,
        31, 31, 30, 31, 30, 31,
      ];
      days = monthDays[currentMonth > 1 ? currentMonth - 2 : 11] + currentDay - d;
      if (months < 0) {
        months = 11;
        years--;
      }
    }

    setResult({ years, months, days });
  };

  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") calculateAge();
  };

  const y1 = result?.years ?? 0;
  const m1 = result?.months ?? 0;
  const d1 = result?.days ?? 0;

  return (
    <>
      <div className="theme-toggle">
        <button id="themeToggle" onClick={toggleTheme}>
          <svg className="sun-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <svg className="moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
      </div>
      <div className="container">
        <div className="formContainer">
          <div className="up">
            <h1>Age Calculator</h1>
          </div>
          <div className="middle">
            <div className="inputcontainer">
              <p className="title">Day</p>
              <input
                type="text"
                name="date"
                id="date"
                placeholder="DD"
                required
                minLength={1}
                maxLength={2}
                value={day}
                onChange={(e) => handleDay(e.target.value)}
                onKeyPress={onEnter}
              />
              <span className="error">{dayError}</span>
            </div>

            <div className="inputcontainer">
              <p className="title">Month</p>
              <input
                type="text"
                name="month"
                id="month"
                placeholder="MM"
                required
                minLength={1}
                maxLength={2}
                value={month}
                onChange={(e) => handleMonth(e.target.value)}
                onKeyPress={onEnter}
              />
              <span className="error">{monthError}</span>
            </div>

            <div className="inputcontainer">
              <p className="title">Year</p>
              <input
                type="text"
                name="year"
                id="year"
                placeholder="YYYY"
                required
                minLength={4}
                maxLength={4}
                value={year}
                onChange={(e) => handleYear(e.target.value)}
                onKeyPress={onEnter}
              />
              <span className="error">{yearError}</span>
            </div>
          </div>

          <div className="bottom">
            <div className="submit-button">
              <button type="button" id="calculateBtn" onClick={calculateAge}>
                Calculate Age
              </button>
            </div>
          </div>

          <div className={`result${result ? " active" : ""}`} id="result">
            <div id="ageResult">
              {result && (
                <>
                  <div>You are</div>
                  <div className="large-text">
                    {y1} {y1 === 1 ? "year" : "years"}, {m1} {m1 === 1 ? "month" : "months"}, and {d1} {d1 === 1 ? "day" : "days"} old
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
