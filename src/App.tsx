import React, { useState, useEffect } from "react";
import "./App.css";

type Response = {
  name: string;
  attending: boolean;
  message: string;
  lastUpdated: Date;
};

const App: React.FC = () => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [form, setForm] = useState<Response>({
    name: "",
    attending: false,
    message: "",
    lastUpdated: new Date(),
  });

  useEffect(() => {
    const storedResponses = localStorage.getItem("responses");
    if (storedResponses) {
      setResponses(JSON.parse(storedResponses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("responses", JSON.stringify(responses));
  }, [responses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existingResponseIndex = responses.findIndex(
      (response) => response.name === form.name
    );

    if (existingResponseIndex >= 0) {
      const timeDiff = Math.abs(
        new Date().getTime() -
          new Date(responses[existingResponseIndex].lastUpdated).getTime()
      );
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (dayDiff <= 7) {
        const updatedResponses = [...responses];
        updatedResponses[existingResponseIndex] = {
          ...form,
          lastUpdated: new Date(),
        };
        setResponses(updatedResponses);
      } else {
        alert("You can only edit your response within 7 days.");
      }
    } else {
      setResponses([...responses, { ...form, lastUpdated: new Date() }]);
    }

    setForm({
      name: "",
      attending: false,
      message: "",
      lastUpdated: new Date(),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="App">
      <h1>Birthday Invitation Response</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Attending:
            <input
              type="checkbox"
              name="attending"
              checked={form.attending}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Message:
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
            ></textarea>
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      <h2>Responses</h2>
      <ul>
        {responses.map((response, index) => (
          <li key={index}>
            <strong>{response.name}</strong> -{" "}
            {response.attending ? "Attending" : "Not Attending"} -{" "}
            {response.message} -{" "}
            <em>
              Last updated: {new Date(response.lastUpdated).toLocaleString()}
            </em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
