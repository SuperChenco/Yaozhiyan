import { useState } from 'react';
import { MapPin, Calendar, Maximize } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { cases } from '@/data/mockData';

interface CasesProps {
}

export default function Cases() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  const selectedCaseData = cases.find((c) => c.id === selectedCase);

  if (selectedCaseData) {
    return (
      <div className="min-h-screen bg-steel-light">
        <Header title={selectedCaseData.name} showBack onBack={() => setSelectedCase(null)} />
        <div className="relative aspect-video bg-steel-light">
          <img
            src={selectedCaseData.images[activeImage]}
            alt={selectedCaseData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {selectedCaseData.images.map((_, index) => (
              // 图片指示点：覆盖Button为最小尺寸圆点
              <Button
                key={index}
                variant="default"
                onClick={() => setActiveImage(index)}
                className={`!p-0 !h-2 !border-0 !shadow-none !rounded-base !bg-steel-white/50 transition-all ${
                  index === activeImage ? '!w-6 !bg-steel-white' : '!w-2'
                }`}
              >
                {null}
              </Button>
            ))}
          </div>
        </div>
        <div className="px-4 py-4">
          <Card className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-steel-light-gray text-sm">
                <MapPin size={14} />
                <span>{selectedCaseData.location}</span>
              </div>
              <div className="flex items-center gap-1 text-steel-light-gray text-sm">
                <Calendar size={14} />
                <span>{selectedCaseData.year}</span>
              </div>
              <div className="flex items-center gap-1 text-steel-light-gray text-sm">
                <Maximize size={14} />
                <span>{selectedCaseData.area}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-rock-blue/10 text-rock-blue text-xs rounded-base">
                {selectedCaseData.type}
              </span>
              {selectedCaseData.products.map((product, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-steel-light text-steel-gray text-xs rounded-base"
                >
                  {product}
                </span>
              ))}
            </div>
            <p className="text-sm text-steel-gray leading-relaxed">{selectedCaseData.description}</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-steel-light pb-20">
      <Header title="成功案例" />

      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {cases.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden cursor-pointer"
              onClick={() => setSelectedCase(item.id)}
            >
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <h3 className="text-sm font-medium text-carbon-black line-clamp-1 mb-1">
                  {item.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-steel-light-gray mb-2">
                  <MapPin size={12} />
                  <span className="line-clamp-1">{item.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-steel-light text-steel-gray text-xs rounded-base">
                    {item.type}
                  </span>
                  <span className="text-xs text-steel-light-gray">{item.area}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
