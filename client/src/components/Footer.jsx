// src/components/Footer.jsx
import React, { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Thanks for subscribing with: ${email}`);
    setEmail('');
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.contentWrapper}>
        {/* ABOUT SECTION */}
        <div style={styles.column}>
          <h3 style={styles.title}>About HealthVault</h3>
          <p style={styles.text}>
            Your health, your control. HealthVault makes it easy to store, view, and manage all your medical records in one place. From smart AI suggestions to secure storage, everything you need for a healthier you — simple, safe, and just a click away.
          </p>
        </div>

        {/* CONTACT SECTION */}
        <div style={styles.column}>
          <h4 style={styles.title}>Contact</h4>
          <p>
            <span role="img" aria-label="phone">📞</span>
            <a href="tel:79xxxxxxxx" style={styles.link}> 79xxxxxxxx</a>
          </p>
          <p>
            <span role="img" aria-label="LinkedIn">🔗</span>
            <a href="https://www.linkedin.com/company/healthvaults/" style={styles.link} target="_blank" rel="noopener noreferrer"> LinkedIn</a>
          </p>
          <p>
            <span role="img" aria-label="Instagram">📸</span>
            <a href=" " style={styles.link} target="_blank" rel="noopener noreferrer"> Instagram</a>
          </p>
        </div>

        {/* NEWSLETTER SECTION */}
        <div style={styles.column}>
          <h4 style={styles.title}>Newsletter</h4>
          <form onSubmit={handleSubscribe} style={styles.form}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Subscribe</button>
          </form>
        </div>
      </div>

      <div style={styles.bottom}>
        © 2025 <strong>HealthVault</strong>. All rights reserved.
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: "linear-gradient(120deg, #182848 0%, #4CAF50 100%)",
    color: "#fff",
    marginTop: "50px",
    borderTopLeftRadius: "32px",
    borderTopRightRadius: "32px",
    boxShadow: "0 -6px 32px 0 rgba(20,40,80,0.18)",
    padding: "50px 12px 24px 12px",
    transition: "all 0.3s"
  },
  contentWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: '54px',
    maxWidth: '1100px',
    margin: 'auto'
  },
  column: {
    flex: '1',
    minWidth: '220px',
    maxWidth: '330px',
    padding: "12px",
    borderRadius: "14px",
    backgroundColor: "rgba(0,0,0,0.07)"
  },
  title: {
    fontSize: "19px",
    fontWeight: "700",
    marginBottom: "14px",
    color: "#e5b94b",
    letterSpacing: "0.5px"
  },
  text: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#ebebeb"
  },
  link: {
    color: "#84f0ff",
    textDecoration: "none",
    marginLeft: 4,
    transition: "color 0.22s"
  },
  form: {
    display: "flex",
    gap: "10px",
    marginTop: "8px"
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    width: "75%",
    minWidth: "130px",
    outline: "none",
    fontSize: "15px"
  },
  button: {
    padding: "10px 18px",
    background: "linear-gradient(90deg,#00c896 60%,#2095a2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 2px 10px 0 rgba(0, 200, 150, 0.08)",
    transition: "background 0.2s,box-shadow 0.2s"
  },
  bottom: {
    marginTop: "34px",
    textAlign: "center",
    fontSize: "15px",
    color: "#e4e4e4"
  }
};

// Responsive styles (using inline media queries for a single file demo only)
const mediaQuery = window.matchMedia('(max-width: 750px)');
if (mediaQuery.matches) {
  styles.contentWrapper.flexDirection = 'column';
  styles.contentWrapper.alignItems = 'center';
  styles.contentWrapper.gap = '22px';
  styles.column.maxWidth = '100%';
}

export default Footer;

