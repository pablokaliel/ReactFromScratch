import { useState, useEffect } from "react";
import Header from "../../components/header";
import "./styles.css";
import Logo from "../../components/logotwo";
import Input from "../../components/input";

import { MdAddLink } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import { db } from "../../services/firebaseConnection";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/languageSwitcher";

function Admin() {
  const [nameInput, setNameInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [backgroundColorInput, setBackgroundColorInput] = useState("#f1f1f1");
  const [textColorInput, setTextColorInput] = useState("#121212");

  const { t } = useTranslation();

  const [links, setLinks] = useState([]);

  useEffect(() => {
    const linksRef = collection(db, "links");
    const queryRef = query(linksRef, orderBy("created", "asc"));

    const unsub = onSnapshot(queryRef, (snapshot) => {
      let list = [];

      snapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          name: doc.data().name,
          url: doc.data().url,
          bg: doc.data().bg,
          color: doc.data().color,
        });
      });
      setLinks(list);
    });
  }, []);

  async function handleRegister(e) {
    e.preventDefault();

    if (nameInput.value === "" || urlInput === "") {
      toast.warn("Fll in all fields.");
      return;
    }

    addDoc(collection(db, "links"), {
      name: nameInput,
      url: urlInput,
      bg: backgroundColorInput,
      color: textColorInput,
      created: new Date(),
    })
      .then(() => {
        setNameInput("");
        setUrlInput("");
        toast.success("Link registered successfully.");
      })
      .catch((error) => {
        console.log("error when registering" + error);
        toast.error("Oops, Error saving.");
      });
  }

  async function handleDeleteLink(id) {
    const docRef = doc(db, "links", id);
    await deleteDoc(docRef);
    toast.warn("Link successfully removed.");
  }

  return (
    <div className="admin-container">
      <LanguageSwitcher />
      <Header />
      <Link to="/">
        <Logo nameone="Creator" nametwo="Links" />
      </Link>

      <form className="form" onSubmit={handleRegister}>
        <label className="label">{t("labelLink")}</label>

        <Input
          placeholder={t("placeLink")}
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />

        <label className="label">{t("labelUrl")}</label>

        <Input
          type="url"
          placeholder={t("placeUrl")}
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />

        <section className="container-colors">
          <div>
            <label className="label right">{t("backgroundLink")}</label>
            <input
              type="color"
              value={backgroundColorInput}
              onChange={(e) => setBackgroundColorInput(e.target.value)}
            />
          </div>

          <div>
            <label className="label right">{t("linkColor")}</label>
            <input
              type="color"
              value={textColorInput}
              onChange={(e) => setTextColorInput(e.target.value)}
            />
          </div>
        </section>

        {nameInput !== "" && (
          <div className="preview">
            <label className="label">{t("preview")}</label>

            <article
              style={{
                marginBottom: 8,
                marginTop: 8,
                backgroundColor: backgroundColorInput,
              }}
              className="list"
            >
              <p style={{ color: textColorInput }}>{nameInput}</p>
            </article>
          </div>
        )}

        <button className="btn-register" type="submit">
          {t("register")} <MdAddLink />
        </button>
      </form>

      <h2 className="title">{t("myLinks")}</h2>

      {links.map((item, index) => (
        <article
          key={index}
          className="list animate-pop"
          style={{ backgroundColor: item.bg, color: item.color }}
        >
          <p>{item.name}</p>

          <div>
            <button
              className="btn-delete"
              onClick={() => handleDeleteLink(item.id)}
            >
              <FiTrash2 size={18} color="#FFF" />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default Admin;
