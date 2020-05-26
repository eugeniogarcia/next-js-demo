import React from 'react';
import Router from 'next/router';
import Layout from "../components/layout";
import utilStyles from "../styles/utils.module.css";

/* También podemos usar la api de routing directamente. Aqui vemos como usarla. En la página dinámica hemos visto otro uso, cuando tenemos fallback activado */

function About() {
    return (
      <Layout>
        <div className={(utilStyles.lightText, utilStyles.headingMd)}>
          Por defecto se hace static redering
        </div>
        <button onClick={() => Router.push("/")}>Atras</button>
      </Layout>
    );
}

export default About