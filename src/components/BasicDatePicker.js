import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";

export function BasicDatePicker({ setDate, intialData }) {
  const [selectedDate, setSelectedDate] = React.useState(null);
  console.log("intialData", intialData);

  React.useEffect(() => {
    if (intialData) {
      setSelectedDate(dayjs(intialData));
    }
  }, [intialData]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setDate(newDate.format("YYYY-MM-DD"));
  };

  const getDateString = () => {
    return selectedDate ? selectedDate.format("YYYY-MM-DD") : "";
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{ width: "96%" }}
          label="Select date"
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </div>
  );
}
