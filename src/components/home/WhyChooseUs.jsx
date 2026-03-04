import { Shield, Award, Users, Clock } from 'lucide-react';
import { features, trustStats } from '../../data/features';
import Badge from '../ui/Badge';

const iconMap = {
  Shield,
  Award,
  Users,
  Clock,
};

export default function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-24 bg-navy-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="bg-primary-blue/20 border-primary-blue text-primary-blue mb-4">
            WHY CHOOSE US
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Your Trusted Real Estate Partner
          </h2>
          <p className="text-text-gray max-w-2xl mx-auto text-gray-300">
            With over 15 years of experience in Dubai's real estate market, we've helped thousands of clients find their perfect property.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <div
                key={index}
                className="bg-slate-800 rounded-xl p-6 text-center hover:bg-slate-700 transition-colors duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary-blue/20 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary-blue" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Statistics Box */}
        <div className="bg-slate-900 rounded-xl p-8 lg:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {trustStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary-blue mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm lg:text-base font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

