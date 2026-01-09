import React from "react";

export default function TreatmentTemplate({ treatment }) {
  const { title, intro, procedure, benefits = [], cost, faqs = [] } = treatment;

  return (
    <main>
      <h1 className="page-title">{title}</h1>

      <section>
        <h4 className="section-title">Introduction</h4>
        <p className="text">{intro}</p>
      </section>

      <section>
        <h4 className="section-title">Procedure</h4>
        <p className="text">{procedure}</p>
      </section>

      <section>
        <h4 className="section-title">Benefits</h4>
        <ul className="list">
          {benefits.map((b, i) => (
            <li key={i} className="list-item">{b}</li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="section-title">Cost</h4>
        <p className="text">{cost}</p>
      </section>

      <section>
        <h4 className="section-title">FAQs</h4>
        <ul className="list">
          {faqs.map((f, i) => (
            <li key={i} className="list-item">
              <p className="text">{f.q}</p>
              <p className="text">{f.a}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
