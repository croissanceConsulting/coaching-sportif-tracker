
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStudent } from '../context/StudentContext';
import Layout from '../components/Layout';
import DashboardHeader from '../components/DashboardHeader';
import { Utensils } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Nutrition = () => {
  const { student } = useStudent();
  const navigate = useNavigate();
  
  // Check if user is logged in
  useEffect(() => {
    if (!student) {
      navigate('/');
    }
  }, [student, navigate]);

  if (!student) return null;

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 pb-8 bg-red-50 rounded-lg"
      >
        <DashboardHeader
          title="Plan Alimentaire"
          subtitle="Suivez votre plan alimentaire personnalisé"
          icon={<Utensils size={20} className="text-red-500" />}
        />

        <Card className="p-6 mt-6 text-center border border-red-200 bg-red-50 shadow-sm">
          <p className="text-muted-foreground">
            Votre plan alimentaire personnalisé sera bientôt disponible.
          </p>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default Nutrition;
