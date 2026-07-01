import "./SupportSection.css";

function SupportSection() {

  return (

    <section className="dashboard-section">

      {/* =========================
          HEADER
      ========================= */}

      <div className="section-header">

        <div>

          <h2>

            Customer Support Center

          </h2>

          <p>

            Manage customer chats, inquiries, and live support

          </p>

        </div>

        <div className="support-header-actions">

          <button className="chat-open-btn">

            Open Frontend Chat

          </button>

          <button className="support-status-btn">

            Online

          </button>

        </div>

      </div>

      {/* =========================
          SUPPORT OVERVIEW
      ========================= */}

      <div className="support-overview">

        <div className="support-card">

          <h3>128</h3>

          <p>Total Messages</p>

        </div>

        <div className="support-card">

          <h3>12</h3>

          <p>Pending Replies</p>

        </div>

        <div className="support-card">

          <h3>5</h3>

          <p>Live Chats</p>

        </div>

        <div className="support-card">

          <h3>98%</h3>

          <p>Customer Satisfaction</p>

        </div>

      </div>

      {/* =========================
          SYSTEM STATUS
      ========================= */}

      <div className="support-box">

        <div className="support-box-top">

          <div className="support-indicator"></div>

          <h3>

            Frontend Chatbot Connected

          </h3>

        </div>

        <p>

          Customer inquiries from the Yatra website chatbot
          will appear here for admin support handling and
          real-time communication.

        </p>

      </div>

      {/* =========================
          CHAT LIST
      ========================= */}

      <div className="chat-list">

        {/* CHAT 1 */}

        <div className="chat-card">

          <div className="chat-top">

            <div className="chat-user">

              <div className="chat-avatar">

                S

              </div>

              <div>

                <h4>

                  Shayan Karki

                </h4>

                <span>

                  5 minutes ago

                </span>

              </div>

            </div>

            <span className="chat-status active">

              Active

            </span>

          </div>

          <div className="chat-message">

            <p>

              Hello, is the Mustang luxury package
              available next week?

            </p>

          </div>

          <div className="chat-actions">

            <button className="reply-btn">

              Reply

            </button>

            <button className="view-btn">

              View Chat

            </button>

          </div>

        </div>

        {/* CHAT 2 */}

        <div className="chat-card">

          <div className="chat-top">

            <div className="chat-user">

              <div className="chat-avatar">

                R

              </div>

              <div>

                <h4>

                  Rohan Sharma

                </h4>

                <span>

                  20 minutes ago

                </span>

              </div>

            </div>

            <span className="chat-status pending">

              Pending

            </span>

          </div>

          <div className="chat-message">

            <p>

              Can I book airport pickup
              with the Prado SUV?

            </p>

          </div>

          <div className="chat-actions">

            <button className="reply-btn">

              Reply

            </button>

            <button className="view-btn">

              View Chat

            </button>

          </div>

        </div>

        {/* CHAT 3 */}

        <div className="chat-card">

          <div className="chat-top">

            <div className="chat-user">

              <div className="chat-avatar">

                A

              </div>

              <div>

                <h4>

                  Alex Johnson

                </h4>

                <span>

                  1 hour ago

                </span>

              </div>

            </div>

            <span className="chat-status resolved">

              Resolved

            </span>

          </div>

          <div className="chat-message">

            <p>

              What is included in the
              Pokhara premium package?

            </p>

          </div>

          <div className="chat-actions">

            <button className="reply-btn">

              Reply

            </button>

            <button className="view-btn">

              View Chat

            </button>

          </div>

        </div>

      </div>

    </section>

  );

}

export default SupportSection;