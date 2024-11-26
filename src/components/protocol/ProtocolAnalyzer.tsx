import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  FileText,
  Calendar,
  ClipboardCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { AnalysisResult, ValidationResult } from '../../types/protocol';
import ProtocolAnalysisService from '../../services/protocolAnalysis';

interface ProtocolAnalyzerProps {
  content: string;
  studyDetails: any;
  onAnalysisComplete: (result: AnalysisResult) => void;
  apiKey: string;
}

const ProtocolAnalyzer: React.FC<ProtocolAnalyzerProps> = ({
  content,
  studyDetails,
  onAnalysisComplete,
  apiKey,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const [progress, setProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const analysisService = new ProtocolAnalysisService(apiKey);

  useEffect(() => {
    if (content && studyDetails) {
      startAnalysis();
    }
  }, [content, studyDetails]);

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    
    try {
      // Start validation
      setCurrentSection('Validating Protocol');
      const validations = await analysisService.validateProtocol(content);
      setValidationResults(validations);
      setProgress(20);

      // Main analysis
      setCurrentSection('Analyzing Protocol Content');
      const analysisResult = await analysisService.analyzeProtocol(content, studyDetails);
      setProgress(60);

      // Generate CRF templates
      setCurrentSection('Generating CRF Templates');
      const crfTemplates = await analysisService.generateCRFTemplates(analysisResult);
      setProgress(80);

      // Generate schedule of assessments
      setCurrentSection('Creating Schedule of Assessments');
      const schedule = await analysisService.generateScheduleOfAssessments(analysisResult);
      setProgress(100);

      // Combine all results
      const finalResult = {
        ...analysisResult,
        crfTemplates,
        schedule,
        validation: validations,
      };

      onAnalysisComplete(finalResult);
    } catch (error) {
      console.error('Analysis failed:', error);
      setValidationResults([
        {
          section: 'Analysis',
          status: 'error',
          message: 'Analysis failed. Please try again.',
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {isAnalyzing ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-4">
            <Brain className="w-6 h-6 text-blue-500 animate-pulse" />
            <span className="text-lg font-medium">{currentSection}</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      ) : (
        <AnimatePresence>
          {validationResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold">Analysis Results</h3>
              
              <div className="space-y-2">
                {validationResults.map((result, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleSection(result.section)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(result.status)}
                        <span className="font-medium">{result.section}</span>
                      </div>
                      {expandedSections.includes(result.section) ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedSections.includes(result.section) && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 bg-gray-50 space-y-3">
                            <p className="text-gray-700">{result.message}</p>
                            
                            {result.details && result.details.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium">Details:</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                  {result.details.map((detail, idx) => (
                                    <li key={idx} className="text-gray-600">
                                      {detail}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {result.recommendations && result.recommendations.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium">Recommendations:</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                  {result.recommendations.map((rec, idx) => (
                                    <li key={idx} className="text-gray-600">
                                      {rec}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ProtocolAnalyzer;
