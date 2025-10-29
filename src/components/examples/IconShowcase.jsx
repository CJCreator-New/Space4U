import { Icon, Icons } from '../common/IconLibrary';

export function IconShowcase() {
  return (
    <div className="p-8 space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Lucide Icons</h2>
        <div className="flex gap-4 flex-wrap">
          <Icon name="Heart" library="lucide" size={32} color="#EF4444" animate />
          <Icon name="Star" library="lucide" size={32} color="#F59E0B" animate />
          <Icon name="Smile" library="lucide" size={32} color="#10B981" animate />
          <Icon name="TrendingUp" library="lucide" size={32} color="#3B82F6" animate />
          <Icon name="Brain" library="lucide" size={32} color="#8B5CF6" animate />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Heroicons Solid</h2>
        <div className="flex gap-4 flex-wrap">
          <Icon name="HeartIcon" library="hero-solid" size={32} color="#EF4444" animate />
          <Icon name="StarIcon" library="hero-solid" size={32} color="#F59E0B" animate />
          <Icon name="SparklesIcon" library="hero-solid" size={32} color="#8B5CF6" animate />
          <Icon name="FireIcon" library="hero-solid" size={32} color="#F97316" animate />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Heroicons Outline</h2>
        <div className="flex gap-4 flex-wrap">
          <Icon name="HeartIcon" library="hero-outline" size={32} color="#EF4444" animate />
          <Icon name="StarIcon" library="hero-outline" size={32} color="#F59E0B" animate />
          <Icon name="SparklesIcon" library="hero-outline" size={32} color="#8B5CF6" animate />
          <Icon name="FireIcon" library="hero-outline" size={32} color="#F97316" animate />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Convenience Exports</h2>
        <div className="flex gap-4 flex-wrap">
          <Icons.Heart size={32} color="#EF4444" animate />
          <Icons.Star size={32} color="#F59E0B" animate />
          <Icons.HeartSolid size={32} color="#EF4444" animate />
          <Icons.StarOutline size={32} color="#F59E0B" animate />
        </div>
      </section>
    </div>
  );
}
