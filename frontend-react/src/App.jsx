import React, { useState } from 'react';
import axios from 'axios';
import { Activity, Heart, Stethoscope, AlertCircle, CheckCircle, ChevronRight, ActivitySquare } from 'lucide-react';

const API_URL = 'http://localhost:8000';

function App() {
  const [formData, setFormData] = useState({
    age: '', sex: '1', cp: '0', trestbps: '', chol: '', fbs: '0', restecg: '0',
    thalachh: '', exang: '0', oldpeak: '', slope: '1', ca: '0', thal: '2'
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    // Convert numeric fields to correct format
    const payload = {
      age: parseInt(formData.age, 10),
      sex: parseInt(formData.sex, 10),
      cp: parseInt(formData.cp, 10),
      trestbps: parseInt(formData.trestbps, 10),
      chol: parseInt(formData.chol, 10),
      fbs: parseInt(formData.fbs, 10),
      restecg: parseInt(formData.restecg, 10),
      thalachh: parseInt(formData.thalachh, 10),
      exang: parseInt(formData.exang, 10),
      oldpeak: parseFloat(formData.oldpeak),
      slope: parseInt(formData.slope, 10),
      ca: parseInt(formData.ca, 10),
      thal: parseInt(formData.thal, 10),
    };

    try {
      const response = await axios.post(`${API_URL}/predict`, payload);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Animated Gradient */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-4xl w-full glass-card overflow-hidden flex flex-col md:flex-row shadow-2xl relative z-10 border border-white/10">
        {/* Left Side Info Panel */}
        <div className="md:w-1/3 bg-gradient-to-br from-primary/90 to-accent/90 p-8 text-white flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20">
                <Heart className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">CardioGuard</h1>
                <p className="text-white/70 text-sm">AI Pulse Intelligence</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-extrabold mb-4 leading-tight">Advanced Heart Disease Risk Prediction</h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              Utilize our state-of-the-art Random Forest machine learning model to assess your cardiovascular health parameters in seconds.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-white/90">
                <Activity className="w-5 h-5 text-green-300" />
                <span>96% Prediction Accuracy</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <Stethoscope className="w-5 h-5 text-blue-300" />
                <span>13 Clinical Features</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <ActivitySquare className="w-5 h-5 text-pink-300" />
                <span>Instant Risk Analysis</span>
              </div>
            </div>
          </div>
          
          <div className="mt-12 relative z-10 pt-6 border-t border-white/20 text-sm text-white/60">
            For demonstration purposes only. Not clinical advice.
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div className="md:w-2/3 p-8 sm:p-12 bg-surface/80 backdrop-blur-xl relative">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="bg-primary/20 text-primary-light p-2 rounded-lg mr-3">
              <Activity className="w-5 h-5 text-primary" />
            </span>
            Enter Patient Vitals
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Vitals Column 1 */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="age">Age</label>
                  <input type="number" id="age" name="age" value={formData.age} onChange={handleInputChange} required className="w-full" placeholder="e.g. 45" />
                </div>
                <div>
                  <label htmlFor="sex">Sex</label>
                  <select id="sex" name="sex" value={formData.sex} onChange={handleInputChange} className="w-full">
                    <option value="1">Male</option>
                    <option value="0">Female</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="cp">Chest Pain Type</label>
                  <select id="cp" name="cp" value={formData.cp} onChange={handleInputChange} className="w-full">
                    <option value="0">Typical Angina</option>
                    <option value="1">Atypical Angina</option>
                    <option value="2">Non-anginal Pain</option>
                    <option value="3">Asymptomatic</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="trestbps">Resting Blood Pressure (mm Hg)</label>
                  <input type="number" id="trestbps" name="trestbps" value={formData.trestbps} onChange={handleInputChange} required className="w-full" placeholder="e.g. 120" />
                </div>
                <div>
                  <label htmlFor="chol">Serum Cholesterol (mg/dl)</label>
                  <input type="number" id="chol" name="chol" value={formData.chol} onChange={handleInputChange} required className="w-full" placeholder="e.g. 200" />
                </div>
                <div>
                  <label htmlFor="fbs">Fasting Blood Sugar > 120 mg/dl</label>
                  <select id="fbs" name="fbs" value={formData.fbs} onChange={handleInputChange} className="w-full">
                    <option value="0">False</option>
                    <option value="1">True</option>
                  </select>
                </div>
              </div>

              {/* Vitals Column 2 */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="restecg">Resting ECG Results</label>
                  <select id="restecg" name="restecg" value={formData.restecg} onChange={handleInputChange} className="w-full">
                    <option value="0">Normal</option>
                    <option value="1">ST-T Wave Abnormality</option>
                    <option value="2">Left Ventricular Hypertrophy</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="thalachh">Max Heart Rate Achieved</label>
                  <input type="number" id="thalachh" name="thalachh" value={formData.thalachh} onChange={handleInputChange} required className="w-full" placeholder="e.g. 150" />
                </div>
                <div>
                  <label htmlFor="exang">Exercise Induced Angina</label>
                  <select id="exang" name="exang" value={formData.exang} onChange={handleInputChange} className="w-full">
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="oldpeak">ST Depression (Oldpeak)</label>
                  <input type="number" step="0.1" id="oldpeak" name="oldpeak" value={formData.oldpeak} onChange={handleInputChange} required className="w-full" placeholder="e.g. 1.0" />
                </div>
                <div>
                  <label htmlFor="slope">Slope of Peak Exercise ST Segment</label>
                  <select id="slope" name="slope" value={formData.slope} onChange={handleInputChange} className="w-full">
                    <option value="0">Upsloping</option>
                    <option value="1">Flat</option>
                    <option value="2">Downsloping</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ca">Major Vessels (0-3)</label>
                    <input type="number" min="0" max="3" id="ca" name="ca" value={formData.ca} onChange={handleInputChange} required className="w-full" placeholder="0-3" />
                  </div>
                  <div>
                    <label htmlFor="thal">Thalassemia</label>
                    <select id="thal" name="thal" value={formData.thal} onChange={handleInputChange} className="w-full">
                      <option value="0">Normal</option>
                      <option value="1">Fixed Defect</option>
                      <option value="2">Reversable Defect</option>
                      <option value="3">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col items-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-primary to-accent hover:from-primaryHover hover:to-primary text-white font-bold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Analyze Cardiovascular Risk</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results Section */}
          <div className={`mt-8 transition-all duration-500 overflow-hidden ${result || error ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3 text-red-200">
                <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-300">Analysis Failed</h4>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}
            
            {result && (
              <div className={`p-6 rounded-2xl glass border ${result.prediction === 1 ? 'border-red-500/30 bg-red-500/5' : 'border-green-500/30 bg-green-500/5'}`}>
                <div className="flex items-start md:items-center space-x-4">
                  <div className={`p-4 rounded-full ${result.prediction === 1 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {result.prediction === 1 ? <AlertCircle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-2xl font-bold tracking-tight ${result.prediction === 1 ? 'text-red-400' : 'text-green-400'}`}>
                      {result.message}
                    </h4>
                    <div className="mt-3 bg-surface/50 rounded-lg p-3 inline-block border border-white/5 text-sm text-gray-300">
                      Model Probability: <span className="text-white font-bold ml-1">{(result.probability * 100).toFixed(1)}%</span>
                      {result.prediction === 1 && <span className="ml-2 px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-300 border border-red-500/20">Critical Attention Needed</span>}
                    </div>
                  </div>
                </div>
                {result.prediction === 1 && (
                   <p className="mt-4 text-sm text-gray-400 border-t border-white/10 pt-4">
                     Please consult with a healthcare professional immediately based on these preliminary AI findings.
                   </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
