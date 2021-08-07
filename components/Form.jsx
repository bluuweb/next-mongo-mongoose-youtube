import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { useState } from "react";

const Form = ({ formData, forNewMovie = true }) => {
  const router = useRouter();

  const [form, setForm] = useState({
    title: formData.title,
    plot: formData.plot,
  });
  const [message, setMenssage] = useState([]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (forNewMovie) {
      postData(form);
    } else {
      // editar data
      putData(form);
    }
  };

  const putData = async (form) => {
    setMenssage([]);
    const { id } = router.query;
    try {
      const res = await fetch(`/api/movie/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data);

      if (!data.success) {
        for (const key in data.error.errors) {
          let error = data.error.errors[key];
          setMenssage((oldmenssage) => [
            ...oldmenssage,
            { message: error.message },
          ]);
        }
      } else {
        setMenssage([]);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const postData = async (form) => {
    try {
      console.log(form);
      const res = await fetch("/api/movie", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data);

      if (!data.success) {
        for (const key in data.error.errors) {
          let error = data.error.errors[key];
          setMenssage((oldmenssage) => [
            ...oldmenssage,
            { message: error.message },
          ]);
        }
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="form-control my-2"
        type="text"
        placeholder="Title"
        autoComplete="off"
        name="title"
        value={form.title}
        onChange={handleChange}
      />
      <input
        className="form-control my-2"
        type="text"
        placeholder="Plot"
        autoComplete="off"
        name="plot"
        value={form.plot}
        onChange={handleChange}
      />
      <button className="btn btn-primary w-100" type="submit">
        {forNewMovie ? "Agregar" : "Editar"}
      </button>
      <Link href="/">
        <a className="btn btn-warning w-100 my-2">Volver...</a>
      </Link>
      {message.map(({ message }) => (
        <p key={message}>{message}</p>
      ))}
    </form>
  );
};

export default Form;
