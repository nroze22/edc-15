import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Upload, FileText, ArrowRight } from 'lucide-react';
import { aiService } from '../../services/ai';
import AnalysisResults from './AnalysisResults';
import { useToast } from '../ui/use-toast';

export default function ProtocolUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFile(file);
    try {
      const text = await file.text();
      setContent(text);
      setError(null);
    } catch (err) {
      setError('Error reading file content');
      toast({
        title: 'Error',
        description: 'Could not read the file content. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleAnalyze = async () => {
    if (!content) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const results = await aiService.analyzeProtocol(content);
      setAnalysisResults(results);
    } catch (err) {
      setError('Error analyzing protocol');
      toast({
        title: 'Analysis Error',
        description: 'An error occurred while analyzing the protocol. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateFinal = async (selectedSuggestions: string[], includeSchedule: boolean) => {
    if (!content || !analysisResults) return;

    try {
      const finalDocs = await aiService.generateFinalDocuments(
        content,
        selectedSuggestions,
        includeSchedule,
        analysisResults
      );

      // Store the generated documents in localStorage for the next page
      localStorage.setItem('finalProtocol', finalDocs.protocol);
      if (finalDocs.schedule) {
        localStorage.setItem('studySchedule', JSON.stringify(finalDocs.schedule));
      }

      // Navigate to study setup with the enhanced protocol
      navigate('/app/study-setup', { 
        state: { 
          protocolContent: finalDocs.protocol,
          studySchedule: finalDocs.schedule
        }
      });

      toast({
        title: 'Success',
        description: 'Protocol analysis complete! Proceeding to study setup.',
      });
    } catch (err) {
      toast({
        title: 'Generation Error',
        description: 'An error occurred while generating the final documents. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Protocol Analysis</h2>
            <p className="text-gray-600">
              Upload your protocol document to analyze and optimize it for your clinical trial
            </p>
          </div>
          {content && !isAnalyzing && !analysisResults && (
            <Button
              onClick={handleAnalyze}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Analyze Protocol
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {!content ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".txt,.doc,.docx,.pdf"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1 text-gray-500">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                PDF, DOC, DOCX or TXT up to 10MB
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {Math.round(content.length / 1024)} KB
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setContent('');
                  setAnalysisResults(null);
                }}
              >
                Change
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Analysis Results */}
      {(isAnalyzing || analysisResults || error) && (
        <AnalysisResults
          results={analysisResults}
          onSuggestionSelection={handleGenerateFinal}
          isLoading={isAnalyzing}
          error={error}
        />
      )}
    </div>
  );
}