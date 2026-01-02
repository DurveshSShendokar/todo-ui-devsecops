import React, { useState, useEffect, use } from "react";
import ThoughtOfTheDay from "./landingpagecomponents/ThoughtOfTheDay";
import BirthdayReminder from "./landingpagecomponents/BirthdayReminder";
import LoginModal from "./landingpagecomponents/LoginModal";
import NotificationCenter from "./landingpagecomponents/NotificationCenter";
import Header from "./landingpagecomponents/Header";
import BulletinBoard from "./landingpagecomponents/BulletinBoard";
import HeroSection from "./landingpagecomponents/HeroSection";
import NewEmployees from "./landingpagecomponents/NewEmployees";
import Careers from "./landingpagecomponents/Careers";
import ProductivityTracking from "./landingpagecomponents/ProductivityTracking";
import ProjectAnalytics from "./landingpagecomponents/ProjectAnalytics";
import Footer from "./landingpagecomponents/Footer"

const ZioTeamsLanding = () => {
  const [showThought, setShowThought] = useState(false);
  const [showBirthdayReminder, setShowBirthdayReminder] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowThought(true), 2000);
  }, []);

  useEffect(() => {
    setTimeout(() => setShowBirthdayReminder(true), 3000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black-900 to-slate-900">
      <ThoughtOfTheDay show={showThought} setShow={setShowThought} />
      <BirthdayReminder
        show={showBirthdayReminder}
        setShow={setShowBirthdayReminder}
      />

      <LoginModal show={showLoginModal} setShow={setShowLoginModal} />
      <NotificationCenter
        show={showNotificationCenter}
        setShow={setShowNotificationCenter}
      />

      <Header
        setShowLoginModal={setShowLoginModal}
        setShowNotificationCenter={setShowNotificationCenter}
      />
      <BulletinBoard />
      <HeroSection />
      <NewEmployees />
      <Careers />
      <ProductivityTracking />
      <ProjectAnalytics />
      <Footer />
    </div>
  );
};

export default ZioTeamsLanding;
