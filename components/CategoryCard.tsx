import Link from 'next/link';
import { Category } from '@/lib/types';
import { ChevronRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.id}`}>
      <div className="group relative overflow-hidden rounded-lg h-48 cursor-pointer">
        {/* Background Image */}
        <img
          src={category.thumbnail}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Dark Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`} />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
          <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-200 mb-3 line-clamp-2">
            {category.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-300">
              {category.videoCount} videos
            </span>
            <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-2 transition-transform" />
          </div>
        </div>

        {/* Hover effect highlight */}
        <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
      </div>
    </Link>
  );
}
