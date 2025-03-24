
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, BookOpen, ArrowDown } from 'lucide-react';
import EbookService from '../services/ebooks/ebookService';
import { Ebook } from '../services/types/airtable.types';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useStudent } from '../context/StudentContext';

const Ebooks = () => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { student } = useStudent();

  useEffect(() => {
    const loadEbooks = async () => {
      try {
        setIsLoading(true);
        const data = await EbookService.getPublishedEbooks();
        setEbooks(data);
      } catch (error) {
        console.error('Erreur lors du chargement des eBooks:', error);
        toast.error('Impossible de charger les eBooks. Veuillez réessayer plus tard.');
      } finally {
        setIsLoading(false);
      }
    };

    loadEbooks();
  }, []);

  const handleDownload = (ebook: Ebook) => {
    if (!ebook.urlEbook) {
      toast.error("Le lien de téléchargement n'est pas disponible.");
      return;
    }
    
    // Ouvrir le lien dans un nouvel onglet
    window.open(ebook.urlEbook, '_blank');
    
    // Afficher un toast de confirmation
    toast.success(`Téléchargement de "${ebook.titre}" commencé`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">eBooks</h1>
              <p className="mt-1 text-gray-500">
                Ressources exclusives pour votre programme
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <BookOpen className="h-5 w-5 text-coach-500 mr-2" />
              <span className="text-sm font-medium">
                {ebooks.length} {ebooks.length > 1 ? 'eBooks disponibles' : 'eBook disponible'}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden h-[360px] animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <CardHeader className="bg-gray-100 h-24" />
                  <CardFooter className="bg-gray-50 h-20" />
                </Card>
              ))}
            </div>
          ) : ebooks.length === 0 ? (
            <div className="text-center py-16">
              <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun eBook disponible</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                De nouveaux eBooks seront bientôt ajoutés à cette bibliothèque.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ebooks.map((ebook) => (
                <motion.div
                  key={ebook.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full flex flex-col overflow-hidden border-2 hover:border-coach-200 transition-all duration-300">
                    <div className="h-48 bg-coach-50 flex items-center justify-center">
                      <Book className="h-16 w-16 text-coach-500" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{ebook.titre}</CardTitle>
                      {ebook.sousTitre && (
                        <CardDescription>{ebook.sousTitre}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {ebook.description || "Aucune description disponible."}
                      </p>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50 pt-4">
                      <Button 
                        onClick={() => handleDownload(ebook)} 
                        className="w-full bg-coach-600 hover:bg-coach-700 flex items-center justify-center gap-2"
                      >
                        <ArrowDown className="h-4 w-4" />
                        Télécharger
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Ebooks;
