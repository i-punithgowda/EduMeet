import React from "react";
import Navbar from "../components/Navbar";
import HomeImage from "../assets/svg/main-home.svg";
import Calender from "../assets/svg/calender.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";

function Home() {
  return (
    <div className="home bg-secondary-content">
      <header>
        <Navbar />
      </header>

      <div className="main flex px-16 my-16  flex-col-reverse  lg:flex-row ">
        <div className="main-content  lg:w-6/12">
          <section>
            <h1 className="text-2xl lg:text-5xl my-5  text-neutral font-bold leading-snug text-left">
              Schedule Your Meetings More Profesionally & More Easily
            </h1>
          </section>
          <article className="lg:text-xl text-justify text-neutral">
            <p>
              Streamline your scheduling as an educator with our custom meeting
              tool. Connect with students, parents, and colleagues with ease and
              focus on what you do best - educating.
            </p>

            <button className="btn btn-secondary w-full lg:w-52 my-8">
              Try now!
            </button>
          </article>
        </div>
        <div className="related-content w-full  lg:w-6/12 flex justify-center items-center">
          <img
            src={HomeImage}
            alt="home image"
            className="sm:w-4/6 md:w-4/6 lg:w-4/6"
          />
        </div>
      </div>

      <div id="features" className="w-full bg-secondary p-6 text-center ">
        <h1 className="text-secondary-content font-bold text-2xl lg:text-4xl pt-16">
          Simple & Effective Features That You Will Get
        </h1>
        <p className="hidden lg:block text-secondary-content pt-5 text-sm font-bold">
          Discover our simple yet effective features designed to enhance your
          video conference experience. Try them out today!
        </p>

        <div className="cards flex flex-col md:flex-row flex-wrap lg:flex-row my-5 justify-center items-center text-sm text-neutral font-bold">
          <div className="card w-72 bg-success shadow-xl  lg:mx-5 mt-5 mr-3 ">
            <div className="card-body">
              <FontAwesomeIcon icon={faAddressCard} color="white" size="3x" />
              <h2 className="font-bold text-md  text-center">
                Free Registration
              </h2>
              <p>Sign up with 0 entry fees , right now!!</p>
            </div>
          </div>

          <div className="card w-72 bg-warning shadow-xl lg:mx-5 mt-5 mr-3">
            <div className="card-body">
              <FontAwesomeIcon icon={faAddressCard} color="white" size="3x" />
              <h2 className="font-bold text-md  text-center">Video Chats</h2>
              <p>Not interrupting and smooth video calls </p>
            </div>
          </div>

          <div className="card w-72 bg-error shadow-xl lg:mx-5 mt-5 mr-3">
            <div className="card-body">
              <FontAwesomeIcon icon={faAddressCard} color="white" size="3x" />
              <h2 className="font-bold text-md  text-center">
                Easy Connections
              </h2>
              <p>Easy Interface to help all kinds of users</p>
            </div>
          </div>

          <div className="card w-72 bg-base-300 shadow-xl lg:mx-5 mt-5 mr-3">
            <div className="card-body">
              <FontAwesomeIcon icon={faAddressCard} color="white" size="3x" />
              <h2 className="font-bold text-md  text-center">
                Secure Sessions
              </h2>
              <p>Do not worry about privacy !! we got it all covered.</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="schedule bg-base-200 w-full flex flex-col lg:flex-row p-5 justify-around items-center "
        id="#schedule"
      >
        <div className="schedule-info lg:w-6/12 flex flex-col justify-evenly items-center">
          <h1 className="text-2xl  text-secondary font-bold text-center ">
            Easily schedule meetings
          </h1>
          <p className="text-sm lg:text-xl text-justify   lg:w-6/12 py-3 leading-8 text-neutral">
            You can easily make and maintain schedules on our site, as well as
            send reminders, all in one location. Furthermore, scheduling
            meetings has never been simpler thanks to our customizable meeting
            types and integrations with widely used calendar apps. Our app
            offers everything you need to plan meetings with customers
            one-on-one or team-wide check-ins.{" "}
          </p>
        </div>
        <div className="schedule-details lg:w-6/12 px-5  flex justify-center items-center">
          <img src={Calender} alt="calender" className="w-96" />
        </div>
      </div>

      <div className="footer" id="contact">
        <footer className="footer p-10 bg-neutral text-neutral-content">
          <div>
            <a className="font-bold normal-case text-xl">
              <span className="text-blue-600 text-xl">Edu</span>Meet
            </a>
            <p>
              Punith Gowda S P
              <br />
              1RV21MC080
            </p>
          </div>
          <div>
            <span className="footer-title">Follow me on </span>
            <div className="grid grid-flow-col gap-4">
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                </svg>
              </a>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
