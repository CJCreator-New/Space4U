import { AnimatedCard } from '../common/AnimatedCard';
import { AnimatedButton } from '../common/AnimatedButton';
import { Icon } from '../common/Icon';
import { Heart, Star, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerChildren } from '../../utils/animations';

export function EnhancedCardExample() {
  const features = [
    { icon: Heart, title: 'Mood Tracking', desc: 'Track your daily emotions' },
    { icon: Star, title: 'Achievements', desc: 'Unlock wellness badges' },
    { icon: TrendingUp, title: 'Progress', desc: 'See your growth over time' }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      {...staggerChildren}
    >
      {features.map((feature, i) => (
        <AnimatedCard key={i} delay={i * 0.1} hover>
          <div className="text-center p-6">
            <Icon icon={feature.icon} size={48} color="#6366F1" animate />
            <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
            <p className="text-gray-600 mb-4">{feature.desc}</p>
            <AnimatedButton variant="primary">Get Started</AnimatedButton>
          </div>
        </AnimatedCard>
      ))}
    </motion.div>
  );
}
