import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  TrendingUp,
  Users,
  ArrowRight,
  Plus,
  PencilRuler,
  ClipboardList,
  Bell,
  ShieldCheck,
  BarChart3,
  MonitorSmartphone,
} from "lucide-react";
import { useRole } from "@/shared/hooks/useRole";
import HomepageImage from "../../../assets/homepageImage.png";
import { useKeycloak } from "@/shared/hooks/useKeycloak";
import { useState, useEffect } from "react";

const services = [
  {
    title: "Event Creation",
    description:
      "Easily create and customize your events with flexible options and detailed management tools.",
    icon: PencilRuler,
    color: "text-blue-600 bg-blue-100",
  },
  {
    title: "Registration Management",
    description:
      "Track attendees and manage registrations efficiently with real-time updates and analytics.",
    icon: ClipboardList,
    color: "text-purple-600 bg-purple-100",
  },
  {
    title: "User Engagement",
    description:
      "Send updates and notifications to keep participants informed and engaged throughout the event.",
    icon: Bell,
    color: "text-emerald-600 bg-emerald-100",
  },
  {
    title: "Secure Authentication",
    description:
      "Robust login system ensures your data and events stay secure with enterprise-level protection.",
    icon: ShieldCheck,
    color: "text-indigo-600 bg-indigo-100",
  },
  {
    title: "Event Analytics",
    description:
      "Get detailed insights and reports on your events' performance and attendee engagement.",
    icon: BarChart3,
    color: "text-orange-600 bg-orange-100",
  },
  {
    title: "Multi-Platform Support",
    description:
      "Access your events from any device with our responsive web platform and mobile support.",
    icon: MonitorSmartphone,
    color: "text-pink-600 bg-pink-100",
  },
];

export function Homepage() {
  const { hasRole } = useRole();
  const { user } = useKeycloak();
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0,
  });

  const finalStats = {
    totalEvents: 24,
    upcomingEvents: 8,
    totalRegistrations: 145,
  };

  useEffect(() => {
    setIsVisible(true);

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        totalEvents: Math.floor(finalStats.totalEvents * progress),
        upcomingEvents: Math.floor(finalStats.upcomingEvents * progress),
        totalRegistrations: Math.floor(
          finalStats.totalRegistrations * progress,
        ),
      });

      if (currentStep >= steps) {
        setAnimatedStats(finalStats);
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 min-h-screen">
      <section className="bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="container mx-auto px-6 py-24 relative z-10 flex flex-col-reverse lg:flex-row items-center gap-12">
          <div
            className={`lg:w-1/2 space-y-6 transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Discover Events That
              <span className="text-blue-800 block">Matter to You</span>
            </h1>
            <div className="inline-block">
              <span className="bg-blue-100 text-black text-sm font-medium px-4 py-2 rounded-full">
                Welcome, {user.name}
              </span>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl">
              Connect with communities, learn new skills, and create meaningful
              experiences through carefully curated events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg hover:scale-105 transform"
              >
                <Link
                  to="/events"
                  className="flex items-center justify-center gap-2"
                >
                  Browse Events
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              {hasRole("Admin") && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 rounded-lg hover:scale-105 transform"
                >
                  <Link
                    to="/admin/create"
                    className="flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5 transition-transform duration-300 hover:rotate-90" />
                    Create Event
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div
            className={`lg:w-1/2 transition-all duration-1000 ease-out delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-200/50 to-purple-200/50 rounded-2xl blur-2xl animate-pulse"></div>
              <img
                src={HomepageImage}
                alt="Hero Banner"
                className="relative rounded-xl shadow-2xl border border-white/20 hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Platform Overview
            </h2>
            <p className="text-gray-600">
              See what's happening on our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-white border border-gray-100 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {animatedStats.totalEvents}
                </div>
                <p className="text-gray-500 font-medium">Total Events</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-100 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {animatedStats.upcomingEvents}
                </div>
                <p className="text-gray-500 font-medium">Upcoming Events</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-100 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {animatedStats.totalRegistrations}
                </div>
                <p className="text-gray-500 font-medium">Registrations</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-white/50 to-gray-50">
        <div className="container mx-auto px-6">
          <div
            className={`text-center mb-16 transition-all duration-800 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "1000ms" }}
          >
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full mb-4 inline-block">
              Our Features
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for
              <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-3">
                Event Success
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the comprehensive suite of tools and features that make
              event management effortless and engaging.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {services.map((service, _index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.title}
                  className={`bg-white/80 backdrop-blur-sm border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-3 hover:scale-105 transition-all duration-500 group transform`}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${service.color} transition-transform duration-300`}
                      >
                        <Icon className="w-4 h-4 transition-transform duration-300" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-gray-700">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
