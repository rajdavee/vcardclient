'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Trash2, Eye, ChevronLeft, ChevronRight, Search, Filter, AlertCircle, UserCircle, MoreVertical, Phone, Globe, MapPin, Mail, X } from 'lucide-react';
import { getAllVCards, deleteVCard } from '../../api/admin';
import VCardModal from './VCardModal';
import VCardPreview from '../../components/VCardPreview';
import { TemplateId } from '@/app/basic/components/Templates';
import LoadingSpinner from '../../components/LoadingSpinner';

// Base Button Component
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
  }
>(({ className = '', variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-100',
    ghost: 'hover:bg-gray-100 hover:text-gray-900',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 py-3 text-lg'
  };

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
});
Button.displayName = 'Button';

// Input Component
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = '', ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
});
Input.displayName = 'Input';

// Select Component
const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className = '', children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = 'Select';

// Card Component
const Card = ({ className = '', children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
};

// Dialog Component
const Dialog = ({
  open,
  onClose,
  children
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        {children}
      </div>
    </div>
  );
};

// Dropdown Menu Component
const DropdownMenu = ({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          {children}
        </div>
      )}
    </div>
  );
};

// Main Component Types
interface VCardManagementProps {
  loadAdminData: () => void;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

interface VCard {
  _id: string;
  userId: User | string;
  templateId: number;
  fields: Array<{ name: string; value: string }>;
  qrCode: string;
  createdAt?: string;
  lastUpdated?: string;
  scanCount?: number;
}

// Main Component
export default function VCardManagement({ loadAdminData }: VCardManagementProps) {
  // States and variables from previous version remain the same
  // ... (continuing in next part due to length)
  // Main Component (continued)
  const [vCards, setVCards] = useState<VCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<VCard[]>([]);
  const [selectedVCard, setSelectedVCard] = useState<VCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('all');
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const CACHE_DURATION = 60000;
  const cardsPerPage = {
    mobile: 4,
    tablet: 6,
    desktop: 9
  };

  const getCardsPerPage = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return cardsPerPage.mobile;
      if (window.innerWidth < 1024) return cardsPerPage.tablet;
      return cardsPerPage.desktop;
    }
    return cardsPerPage.desktop;
  };

  const [itemsPerPage, setItemsPerPage] = useState(getCardsPerPage());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getCardsPerPage());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const now = Date.now();
    if (now - lastFetchTime > CACHE_DURATION) {
      fetchVCards();
      setLastFetchTime(now);
    }
  }, [lastFetchTime]);

  useEffect(() => {
    filterVCards();
  }, [searchQuery, selectedTemplate, vCards]);

  const fetchVCards = async () => {
    setIsLoading(true);
    try {
      const data = await getAllVCards();
      setVCards(data);
      setFilteredCards(data);
    } catch (error) {
      setError('Failed to load vCards. Please try again later.');
      setVCards([]);
      setFilteredCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterVCards = () => {
    let filtered = [...vCards];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(card => 
        card.fields.some(field => field.value.toLowerCase().includes(query)) ||
        (typeof card.userId === 'object' && card.userId.email.toLowerCase().includes(query))
      );
    }

    if (selectedTemplate !== 'all') {
      filtered = filtered.filter(card => card.templateId === parseInt(selectedTemplate));
    }

    setFilteredCards(filtered);
    setCurrentPage(1);
  };

  const handleDeleteVCard = async (vCardId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this vCard?');
    if (!confirmed) return;

    try {
      await deleteVCard(vCardId);
      await fetchVCards();
      loadAdminData();
    } catch (error) {
      setError('Failed to delete vCard. Please try again.');
    }
  };

  const getUserEmail = (vCard: VCard) => {
    return typeof vCard.userId === 'object' ? vCard.userId.email : 'Email not available';
  };

  const indexOfLastCard = currentPage * itemsPerPage;
  const indexOfFirstCard = indexOfLastCard - itemsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const DropdownMenuItem = ({ onClick, children, className = '' }: {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header Section */}
        <header className="mb-6 sm:mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            vCard Management
          </h1>
          <p className="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Manage and track your digital business cards
          </p>
        </header>

        {/* Search and Filter Section */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search vCards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full sm:w-[180px]"
          >
            <option value="all">All Templates</option>
            {Array.from({ length: 6 }, (_, i) => (
              <option key={i + 1} value={(i + 1).toString()}>
                Template {i + 1}
              </option>
            ))}
          </Select>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 text-red-600">
            <AlertCircle className="mr-2" />
            <span>{error}</span>
          </div>
        ) : (
          <>
            {/* Cards Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {/* ... (continuing in next part) */}
              {currentCards.map((vCard) => (
                <Card key={vCard._id} className="group hover:shadow-lg transition-shadow duration-200">
                  <div className="p-4">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <div className="flex items-center space-x-4">
                        <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gray-100 flex items-center justify-center">
                          <UserCircle className="h-6 w-6 sm:h-7 sm:w-7 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg sm:text-xl text-gray-900">
                            {vCard.fields.find(f => f.name === 'name')?.value || 'Unnamed'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {vCard.fields.find(f => f.name === 'jobTitle')?.value || 'No title'}
                          </p>
                        </div>
                      </div>

                      <DropdownMenu
                        trigger={
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        }
                      >
                        <DropdownMenuItem onClick={() => { setSelectedVCard(vCard); setIsPreviewOpen(true); }}>
                          <Eye className="mr-2 h-4 w-4" /> Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedVCard(vCard); setIsModalOpen(true); }}>
                          <Edit3 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteVCard(vCard._id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenu>
                    </div>

                    <div className="pt-4 space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="truncate">{getUserEmail(vCard)}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span>{vCard.fields.find(f => f.name === 'phone')?.value || 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="truncate">
                          {vCard.fields.find(f => f.name === 'address')?.value || 'N/A'}
                        </span>
                      </div>
                      <div className="pt-2 text-sm text-gray-600">
                        <div>Updated: {formatDate(vCard.lastUpdated)}</div>
                        <div>Scans: {vCard.scanCount || 0}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {filteredCards.length > 0 && (
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Showing {indexOfFirstCard + 1} to {Math.min(indexOfLastCard, filteredCards.length)} of {filteredCards.length} entries
                </p>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">Previous</span>
                  </Button>
                  
                  <span className="text-sm px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <span className="mr-1 hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredCards.length === 0 && !isLoading && !error && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <AlertCircle className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No vCards Found</p>
                <p className="text-sm mt-2">Try adjusting your search criteria</p>
              </div>
            )}
          </>
        )}

        {/* Modals */}
        {isModalOpen && selectedVCard && (
          <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <VCardModal
              vCard={selectedVCard}
              onClose={() => setIsModalOpen(false)}
              onSave={() => {
                fetchVCards();
                setIsModalOpen(false);
              }}
            />
          </Dialog>
        )}


{isPreviewOpen && selectedVCard && (
  <Dialog open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
    <div className="relative max-h-[90vh] overflow-y-auto">
      {/* Close button - now positioned absolutely in the top-right corner */}
      <button
        onClick={() => setIsPreviewOpen(false)}
        className="absolute right-0 top-0 p-2 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Close preview"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Header Section with more padding and better spacing */}
      <div className="mb-6 pr-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {selectedVCard.fields.find(f => f.name === 'name')?.value || 'Unnamed'}
        </h2>
        <p className="text-md text-gray-600 mt-1">
          {selectedVCard.fields.find(f => f.name === 'jobTitle')?.value || 'No title'}
        </p>
      </div>

      {/* Details Section with better organization */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          <div className="flex items-center text-gray-700">
            <Mail className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">{getUserEmail(selectedVCard)}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Phone className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">
              {selectedVCard.fields.find(f => f.name === 'phone')?.value || 'N/A'}
            </span>
          </div>
          <div className="flex items-center text-gray-700">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">
              {selectedVCard.fields.find(f => f.name === 'address')?.value || 'N/A'}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center text-gray-700">
            <Globe className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">
              {selectedVCard.fields.find(f => f.name === 'website')?.value || 'N/A'}
            </span>
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-medium">Last Updated:</span>
            <span className="ml-2">{formatDate(selectedVCard.lastUpdated)}</span>
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-medium">Total Scans:</span>
            <span className="ml-2">{selectedVCard.scanCount || 0}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* Preview Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Preview</h3>
        <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
          <VCardPreview
            previewData={{
              templateId: selectedVCard.templateId as TemplateId,
              fields: selectedVCard.fields,
              qrCodeDataUrl: selectedVCard.qrCode
            }}
          />
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-6 flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => setIsPreviewOpen(false)}
          className="px-4 py-2"
        >
          Close Preview
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            setIsPreviewOpen(false);
            setSelectedVCard(selectedVCard);
            setIsModalOpen(true);
          }}
          className="px-4 py-2"
        >
          Edit Card
        </Button>
      </div>
    </div>
  </Dialog>
)}







      </div>
    </div>
  );
}