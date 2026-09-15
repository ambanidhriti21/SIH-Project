import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API =
  import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {

  const [token, setToken] =
    useState(localStorage.getItem('token'));

  const [user, setUser] = useState(null);

  const [page, setPage] =
    useState('dashboard');

  const [data, setData] =
    useState(null);

  const [file, setFile] =
    useState(null);

  const [busy, setBusy] =
    useState(false);

  const [auth, setAuth] =
    useState('login');

  const [error, setError] =
    useState('');

  const [language, setLanguage] =
    useState('en');

  const [form, setForm] =
    useState({
      name: '',
      email: '',
      password: ''
    });


  /* =========================================================
     TRANSLATIONS
  ========================================================= */

  const translations = {

    en: {

      dashboard: 'Dashboard',
      analyze: 'Analyze Leaf',
      history: 'History',
      weather: 'Weather Advisor',
      logout: 'Logout',

      welcome: 'Welcome',

      aiDetection: 'AI Detection',

      historyTitle: 'PostgreSQL History',

      architecture: 'Architecture',

      analyzeLeaf: 'Analyze a leaf',

      viewHistory: 'View history',

      analyzeAI: 'Analyze with AI',

      selected: 'Selected',

      resultAnalyzeAnother:
        'Analyze another',

      confidence: 'confidence',

      crop: 'Crop',

      symptoms: 'Symptoms',

      organicCure: 'Organic Cure',

      chemicalCure: 'Chemical Cure',

      prevention: 'Prevention',

      infoSource: 'Information source',

      noResult: 'No result yet.',

      predictionHistory:
        'Prediction History',

      noPredictions:
        'No predictions yet.',

      analyzing: 'Analyzing...',

      login: 'Login',

      register: 'Register',

      fullName: 'Full name',

      email: 'Email',

      password: 'Password',

      createAccount:
        'Create account',

      aiPowered:
        'AI-powered crop disease detection',

      dashboardAIText:
        'Upload a leaf image and get disease, confidence and treatment guidance.',

      dashboardHistoryText:
        'Your previous predictions are stored securely and available in the history dashboard.',

      dashboardWeatherText:
        'Get weather-based agricultural recommendations for your location.',

      architectureText:
        'React → FastAPI Backend → AI Service → PostgreSQL',


      /* WEATHER */

      weatherTitle:
        'Weather Advisor',

      weatherSubtitle:
        'Get weather-based agricultural recommendations for your location.',

      enterCity:
        'Enter city',

      searchWeather:
        'Get Weather',

      searchingWeather:
        'Loading weather...',

      temperature:
        'Temperature',

      humidity:
        'Humidity',

      rainProbability:
        'Rain Probability',

      windSpeed:
        'Wind Speed',

      condition:
        'Condition',

      irrigationAdvice:
        'Irrigation Advice',

      diseaseRisk:
        'Disease Risk',

      sprayingAdvice:
        'Spraying Advice',

      weatherSource:
        'Weather data: Open-Meteo',

      enterCityMessage:
        'Please enter a city name.',

      weatherNotFound:
        'Location not found. Please try another city.',

      weatherError:
        'Unable to fetch weather. Please try again.',

      moderate:
        'Moderate',

      high:
        'High',

      low:
        'Low',

      combineWeather:
        'Combine this weather advice with leaf disease detection for better crop monitoring.'
    },


    hi: {

      dashboard: 'डैशबोर्ड',

      analyze: 'पत्ते का विश्लेषण',

      history: 'इतिहास',

      weather: 'मौसम सलाह',

      logout: 'लॉग आउट',

      welcome: 'स्वागत है',

      aiDetection:
        'AI रोग पहचान',

      historyTitle:
        'पिछला रिकॉर्ड',

      architecture:
        'सिस्टम आर्किटेक्चर',

      analyzeLeaf:
        'पत्ते का विश्लेषण करें',

      viewHistory:
        'इतिहास देखें',

      analyzeAI:
        'AI से विश्लेषण करें',

      selected:
        'चयनित',

      resultAnalyzeAnother:
        'एक और विश्लेषण करें',

      confidence:
        'विश्वास',

      crop:
        'फसल',

      symptoms:
        'लक्षण',

      organicCure:
        'जैविक उपचार',

      chemicalCure:
        'रासायनिक उपचार',

      prevention:
        'रोकथाम',

      infoSource:
        'जानकारी का स्रोत',

      noResult:
        'अभी कोई परिणाम नहीं है।',

      predictionHistory:
        'पूर्वानुमान इतिहास',

      noPredictions:
        'अभी कोई पूर्वानुमान नहीं है।',

      analyzing:
        'विश्लेषण हो रहा है...',

      login:
        'लॉग इन',

      register:
        'रजिस्टर',

      fullName:
        'पूरा नाम',

      email:
        'ईमेल',

      password:
        'पासवर्ड',

      createAccount:
        'खाता बनाएं',

      aiPowered:
        'AI आधारित फसल रोग पहचान',

      dashboardAIText:
        'पत्ते की तस्वीर अपलोड करें और रोग, विश्वास स्तर तथा उपचार संबंधी जानकारी प्राप्त करें।',

      dashboardHistoryText:
        'आपके पिछले पूर्वानुमान सुरक्षित रूप से संग्रहीत हैं और इतिहास डैशबोर्ड में उपलब्ध हैं।',

      dashboardWeatherText:
        'अपने स्थान के मौसम के आधार पर कृषि संबंधी सलाह प्राप्त करें।',

      architectureText:
        'React → FastAPI Backend → AI Service → PostgreSQL',


      /* WEATHER */

      weatherTitle:
        'मौसम सलाह',

      weatherSubtitle:
        'अपने स्थान के मौसम के आधार पर कृषि संबंधी सलाह प्राप्त करें।',

      enterCity:
        'शहर का नाम दर्ज करें',

      searchWeather:
        'मौसम देखें',

      searchingWeather:
        'मौसम लोड हो रहा है...',

      temperature:
        'तापमान',

      humidity:
        'नमी',

      rainProbability:
        'बारिश की संभावना',

      windSpeed:
        'हवा की गति',

      condition:
        'मौसम की स्थिति',

      irrigationAdvice:
        'सिंचाई सलाह',

      diseaseRisk:
        'रोग का जोखिम',

      sprayingAdvice:
        'स्प्रे करने की सलाह',

      weatherSource:
        'मौसम डेटा: Open-Meteo',

      enterCityMessage:
        'कृपया शहर का नाम दर्ज करें।',

      weatherNotFound:
        'स्थान नहीं मिला। कृपया दूसरा शहर आज़माएं।',

      weatherError:
        'मौसम प्राप्त नहीं हो सका। कृपया फिर प्रयास करें।',

      moderate:
        'मध्यम',

      high:
        'उच्च',

      low:
        'कम',

      combineWeather:
        'बेहतर फसल निगरानी के लिए इस मौसम सलाह को पत्तियों की AI रोग पहचान के साथ उपयोग करें।'
    },


    gu: {

      dashboard:
        'ડેશબોર્ડ',

      analyze:
        'પાનનું વિશ્લેષણ',

      history:
        'ઇતિહાસ',

      weather:
        'હવામાન સલાહ',

      logout:
        'લૉગ આઉટ',

      welcome:
        'સ્વાગત છે',

      aiDetection:
        'AI રોગ ઓળખ',

      historyTitle:
        'પાછલો રેકોર્ડ',

      architecture:
        'સિસ્ટમ આર્કિટેક્ચર',

      analyzeLeaf:
        'પાનનું વિશ્લેષણ કરો',

      viewHistory:
        'ઇતિહાસ જુઓ',

      analyzeAI:
        'AI સાથે વિશ્લેષણ કરો',

      selected:
        'પસંદ કરેલ',

      resultAnalyzeAnother:
        'ફરી એક વિશ્લેષણ કરો',

      confidence:
        'વિશ્વાસ',

      crop:
        'પાક',

      symptoms:
        'લક્ષણો',

      organicCure:
        'જૈવિક ઉપચાર',

      chemicalCure:
        'રાસાયણિક ઉપચાર',

      prevention:
        'રોકથામ',

      infoSource:
        'માહિતીનો સ્ત્રોત',

      noResult:
        'હજુ કોઈ પરિણામ નથી.',

      predictionHistory:
        'પૂર્વાનુમાન ઇતિહાસ',

      noPredictions:
        'હજુ કોઈ પૂર્વાનુમાન નથી.',

      analyzing:
        'વિશ્લેષણ થઈ રહ્યું છે...',

      login:
        'લૉગ ઇન',

      register:
        'રજીસ્ટર',

      fullName:
        'પૂરું નામ',

      email:
        'ઇમેઇલ',

      password:
        'પાસવર્ડ',

      createAccount:
        'ખાતું બનાવો',

      aiPowered:
        'AI આધારિત પાક રોગ ઓળખ',

      dashboardAIText:
        'પાનની તસવીર અપલોડ કરો અને રોગ, વિશ્વાસ સ્તર તથા સારવારની માહિતી મેળવો.',

      dashboardHistoryText:
        'તમારા અગાઉના પૂર્વાનુમાનો સુરક્ષિત રીતે સંગ્રહિત છે અને ઇતિહાસ ડેશબોર્ડમાં ઉપલબ્ધ છે.',

      dashboardWeatherText:
        'તમારા સ્થળના હવામાનના આધારે ખેતી માટે ઉપયોગી સલાહ મેળવો.',

      architectureText:
        'React → FastAPI Backend → AI Service → PostgreSQL',


      /* WEATHER */

      weatherTitle:
        'હવામાન સલાહ',

      weatherSubtitle:
        'તમારા સ્થળના હવામાનના આધારે ખેતી માટે ઉપયોગી સલાહ મેળવો.',

      enterCity:
        'શહેરનું નામ દાખલ કરો',

      searchWeather:
        'હવામાન જુઓ',

      searchingWeather:
        'હવામાન લોડ થઈ રહ્યું છે...',

      temperature:
        'તાપમાન',

      humidity:
        'ભેજ',

      rainProbability:
        'વરસાદની શક્યતા',

      windSpeed:
        'પવનની ઝડપ',

      condition:
        'હવામાનની સ્થિતિ',

      irrigationAdvice:
        'સિંચાઈ સલાહ',

      diseaseRisk:
        'રોગનું જોખમ',

      sprayingAdvice:
        'સ્પ્રે કરવાની સલાહ',

      weatherSource:
        'હવામાન ડેટા: Open-Meteo',

      enterCityMessage:
        'કૃપા કરીને શહેરનું નામ દાખલ કરો.',

      weatherNotFound:
        'સ્થાન મળ્યું નથી. કૃપા કરીને બીજું શહેર અજમાવો.',

      weatherError:
        'હવામાન મેળવી શકાયું નથી. ફરી પ્રયાસ કરો.',

      moderate:
        'મધ્યમ',

      high:
        'ઉચ્ચ',

      low:
        'ઓછું',

      combineWeather:
        'વધુ સારી પાક દેખરેખ માટે આ હવામાન સલાહને પાનની AI રોગ ઓળખ સાથે ઉપયોગ કરો.'
    }
  };


  const t =
    translations[language];


  /* =========================================================
     DISEASE NAME TRANSLATIONS
  ========================================================= */

  const diseaseTranslations = {

    Tomato___Early_blight: {
      hi: {
        disease: 'टमाटर अर्ली ब्लाइट'
      },
      gu: {
        disease: 'ટામેટાનું અર્લી બ્લાઇટ'
      }
    },

    Tomato___Late_blight: {
      hi: {
        disease: 'टमाटर लेट ब्लाइट'
      },
      gu: {
        disease: 'ટામેટાનું લેટ બ્લાઇટ'
      }
    },

    Tomato___Healthy: {
      hi: {
        disease: 'टमाटर स्वस्थ'
      },
      gu: {
        disease: 'ટામેટું સ્વસ્થ'
      }
    },

    Potato___Early_blight: {
      hi: {
        disease: 'आलू अर्ली ब्लाइट'
      },
      gu: {
        disease: 'બટાકાનું અર્લી બ્લાઇટ'
      }
    },

    Potato___Late_blight: {
      hi: {
        disease: 'आलू लेट ब्लाइट'
      },
      gu: {
        disease: 'બટાકાનું લેટ બ્લાઇટ'
      }
    },

    Potato___Healthy: {
      hi: {
        disease: 'आलू स्वस्थ'
      },
      gu: {
        disease: 'બટાકા સ્વસ્થ'
      }
    },

    'Corn_(Maize)___Common_rust': {
      hi: {
        disease: 'मक्का कॉमन रस्ट'
      },
      gu: {
        disease: 'મકાઈ કોમન રસ્ટ'
      }
    },

    'Corn_(Maize)___Healthy': {
      hi: {
        disease: 'मक्का स्वस्थ'
      },
      gu: {
        disease: 'મકાઈ સ્વસ્થ'
      }
    },

    Apple___Apple_scab: {
      hi: {
        disease: 'सेब स्कैब'
      },
      gu: {
        disease: 'સફરજન સ્કેબ'
      }
    },

    Apple___Healthy: {
      hi: {
        disease: 'सेब स्वस्थ'
      },
      gu: {
        disease: 'સફરજન સ્વસ્થ'
      }
    },

    Rice___Brown_spot: {
      hi: {
        disease: 'चावल ब्राउन स्पॉट'
      },
      gu: {
        disease: 'ચોખાનો બ્રાઉન સ્પોટ'
      }
    },

    Rice___Healthy: {
      hi: {
        disease: 'चावल स्वस्थ'
      },
      gu: {
        disease: 'ચોખા સ્વસ્થ'
      }
    }
  };


  /* =========================================================
     API REQUEST FUNCTION
  ========================================================= */

  const req = async (
    path,
    opt = {}
  ) => {

    const h =
      opt.headers || {};

    if (token) {
      h.Authorization =
        `Bearer ${token}`;
    }

    const r =
      await fetch(
        API + path,
        {
          ...opt,
          headers: h
        }
      );

    const j =
      await r.json().catch(
        () => ({
          detail:
            'Server error'
        })
      );

    if (!r.ok) {
      throw Error(
        j.detail ||
        'Request failed'
      );
    }

    return j;
  };


  /* =========================================================
     CHECK CURRENT USER
  ========================================================= */

  useEffect(() => {

    if (token) {

      req('/auth/me')
        .then(setUser)
        .catch(() => {

          localStorage.removeItem(
            'token'
          );

          setToken(null);

        });

    }

  }, [token]);


  /* =========================================================
     LOGIN / REGISTER
  ========================================================= */

  const login = async (e) => {

    e.preventDefault();

    setError('');

    try {

      const j =
        await req(
          auth === 'login'
            ? '/auth/login'
            : '/auth/register',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body:
              JSON.stringify(form)
          }
        );

      localStorage.setItem(
        'token',
        j.access_token
      );

      setToken(
        j.access_token
      );

      setForm({
        name: '',
        email: '',
        password: ''
      });

    } catch (x) {

      setError(
        x.message
      );

    }
  };


  /* =========================================================
     HISTORY
  ========================================================= */

  const loadHistory =
    () =>
      req('/history')
        .then(
          (j) =>
            setData(j.history)
        );


  useEffect(() => {

    if (
      token &&
      page === 'history'
    ) {

      loadHistory();

    }

  }, [
    token,
    page
  ]);


  /* =========================================================
     AI ANALYSIS
  ========================================================= */

  const analyze =
    async () => {

      if (!file) {
        return;
      }

      setBusy(true);

      setError('');

      try {

        const fd =
          new FormData();

        fd.append(
          'file',
          file
        );

        const j =
          await req(
            '/predict',
            {
              method: 'POST',
              body: fd
            }
          );

        setData(
          j.data
        );

        setPage(
          'result'
        );

      } catch (x) {

        setError(
          x.message
        );

      } finally {

        setBusy(false);

      }
    };


  /* =========================================================
     AUTH SCREEN
  ========================================================= */

  if (!token) {

    return (

      <div className="auth">

        <div className="card authcard">

          <div className="language">

            <label>
              🌐
            </label>

            <select
              value={language}
              onChange={(e) =>
                setLanguage(
                  e.target.value
                )
              }
            >

              <option value="en">
                English
              </option>

              <option value="hi">
                हिन्दी
              </option>

              <option value="gu">
                ગુજરાતી
              </option>

            </select>

          </div>


          <h1>
            🌱 AgriSmart
          </h1>

          <p>
            {t.aiPowered}
          </p>


          <div className="tabs">

            <button
              onClick={() =>
                setAuth('login')
              }
              className={
                auth === 'login'
                  ? 'active'
                  : ''
              }
            >
              {t.login}
            </button>


            <button
              onClick={() =>
                setAuth('register')
              }
              className={
                auth === 'register'
                  ? 'active'
                  : ''
              }
            >
              {t.register}
            </button>

          </div>


          <form
            onSubmit={login}
          >

            {auth === 'register' && (

              <input
                placeholder={
                  t.fullName
                }

                value={
                  form.name
                }

                onChange={(e) =>
                  setForm({
                    ...form,
                    name:
                      e.target.value
                  })
                }
              />

            )}


            <input
              type="email"

              placeholder={
                t.email
              }

              value={
                form.email
              }

              onChange={(e) =>
                setForm({
                  ...form,
                  email:
                    e.target.value
                })
              }
            />


            <input
              type="password"

              placeholder={
                t.password
              }

              value={
                form.password
              }

              onChange={(e) =>
                setForm({
                  ...form,
                  password:
                    e.target.value
                })
              }
            />


            {error && (
              <div className="error">
                {error}
              </div>
            )}


            <button
              className="primary"
            >
              {auth === 'login'
                ? t.login
                : t.createAccount}
            </button>

          </form>

        </div>

      </div>
    );
  }


  /* =========================================================
     MAIN APPLICATION
  ========================================================= */

  return (

    <div>

      <header>

        <div>

          <b>
            🌱 AgriSmart
          </b>

          <span>
            Crop Disease Detection &
            Cure Recommendation
          </span>

        </div>


        <div className="language">

          <label>
            🌐
          </label>

          <select
            value={language}
            onChange={(e) =>
              setLanguage(
                e.target.value
              )
            }
          >

            <option value="en">
              English
            </option>

            <option value="hi">
              हिन्दी
            </option>

            <option value="gu">
              ગુજરાતી
            </option>

          </select>

        </div>


        <button
          onClick={() => {

            localStorage.removeItem(
              'token'
            );

            setToken(null);

            setUser(null);

          }}
        >
          {t.logout}
        </button>

      </header>


      <nav>

        <button
          onClick={() =>
            setPage('dashboard')
          }
        >
          {t.dashboard}
        </button>


        <button
          onClick={() =>
            setPage('analyze')
          }
        >
          {t.analyze}
        </button>


        <button
          onClick={() =>
            setPage('history')
          }
        >
          {t.history}
        </button>


        <button
          onClick={() =>
            setPage('weather')
          }
        >
          🌦️ {t.weather}
        </button>

      </nav>


      <main>

        {page === 'dashboard' && (

          <Dashboard
            user={user}
            go={setPage}
            t={t}
          />

        )}


        {page === 'analyze' && (

          <Analyze
            file={file}
            setFile={setFile}
            analyze={analyze}
            busy={busy}
            t={t}
          />

        )}


        {page === 'result' && (

          <Result
            data={data}
            go={() =>
              setPage('analyze')
            }
            t={t}
            language={language}
            diseaseTranslations={
              diseaseTranslations
            }
          />

        )}


        {page === 'history' && (

          <History
            rows={
              Array.isArray(data)
                ? data
                : []
            }

            t={t}

            language={language}

            diseaseTranslations={
              diseaseTranslations
            }
          />

        )}


        {page === 'weather' && (

          <Weather
            t={t}
            language={language}
          />

        )}


        {error && (

          <div className="error global">
            {error}
          </div>

        )}

      </main>

    </div>
  );
}


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  user,
  go,
  t
}) {

  return (

    <section>

      <h2>
        {t.welcome},{' '}
        {user?.name}
      </h2>


      <div className="grid">


        <div className="stat">

          <b>
            {t.aiDetection}
          </b>

          <p>
            {t.dashboardAIText}
          </p>

          <button
            className="primary"
            onClick={() =>
              go('analyze')
            }
          >
            {t.analyzeLeaf}
          </button>

        </div>


        <div className="stat">

          <b>
            {t.historyTitle}
          </b>

          <p>
            {t.dashboardHistoryText}
          </p>

          <button
            onClick={() =>
              go('history')
            }
          >
            {t.viewHistory}
          </button>

        </div>


        <div className="stat">

          <b>
            🌦️ {t.weather}
          </b>

          <p>
            {t.dashboardWeatherText}
          </p>

          <button
            onClick={() =>
              go('weather')
            }
          >
            {t.weather}
          </button>

        </div>


        <div className="stat">

          <b>
            {t.architecture}
          </b>

          <p>
            {t.architectureText}
          </p>

        </div>

      </div>

    </section>
  );
}


/* =========================================================
   ANALYZE PAGE
========================================================= */

function Analyze({
  file,
  setFile,
  analyze,
  busy,
  t
}) {

  return (

    <section>

      <h2>
        {t.analyze}
      </h2>


      <div className="upload">

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFile(
              e.target.files?.[0]
            )
          }
        />


        {file && (

          <>

            <p>
              {t.selected}:{' '}
              {file.name}
            </p>


            <img
              src={
                URL.createObjectURL(
                  file
                )
              }
              className="preview"
            />

          </>

        )}


        <button
          className="primary"
          disabled={
            !file || busy
          }
          onClick={
            analyze
          }
        >

          {busy
            ? t.analyzing
            : '🔍 ' +
              t.analyzeAI}

        </button>

      </div>

    </section>
  );
}


/* =========================================================
   RESULT PAGE
========================================================= */

function Result({
  data,
  go,
  t,
  language,
  diseaseTranslations
}) {

  if (!data) {

    return (

      <section>

        <p>
          {t.noResult}
        </p>

      </section>
    );
  }


  const diseaseInfo =
    diseaseTranslations[
      data.class_id
    ];


  const translatedDisease =
    diseaseInfo?.[
      language
    ]?.disease ||

    diseaseInfo?.en?.disease ||

    data.disease;


  return (

    <section>

      <button
        onClick={go}
      >
        ← {t.resultAnalyzeAnother}
      </button>


      <div className="result">

        <h2>
          {translatedDisease}
        </h2>


        <div className="chips">

          <span>
            {data.status}
          </span>

          <span>
            {data.severity}
          </span>

          <span>
            {data.confidence_percentage}%
            {' '}
            {t.confidence}
          </span>

        </div>


        <p>

          <b>
            {t.crop}:
          </b>{' '}

          {data.plant}

        </p>


        <h3>
          {t.symptoms}
        </h3>


        <ul>

          {(data.symptoms || [])
            .map((x, i) => (

              <li key={i}>
                {x}
              </li>

            ))}

        </ul>


        <div className="two">


          <div>

            <h3>
              🌿 {t.organicCure}
            </h3>

            <p>
              {data.organic_cure}
            </p>

          </div>


          <div>

            <h3>
              🧪 {t.chemicalCure}
            </h3>

            <p>
              {data.chemical_cure}
            </p>

          </div>

        </div>


        <h3>
          {t.prevention}
        </h3>


        <ul>

          {(data.prevention || [])
            .map((x, i) => (

              <li key={i}>
                {x}
              </li>

            ))}

        </ul>


        <small>
          {t.infoSource}:
          {' '}
          PostgreSQL disease catalog
        </small>

      </div>

    </section>
  );
}


/* =========================================================
   HISTORY PAGE
========================================================= */

function History({
  rows,
  t,
  language,
  diseaseTranslations
}) {

  return (

    <section>

      <h2>
        {t.predictionHistory}
      </h2>


      {!rows.length ? (

        <p>
          {t.noPredictions}
        </p>

      ) : (

        <div className="history">

          {rows.map((r) => {

            const diseaseInfo =
              diseaseTranslations[
                r.class_id
              ];


            const translatedDisease =
              diseaseInfo?.[
                language
              ]?.disease ||

              diseaseInfo?.en?.disease ||

              r.disease;


            return (

              <div
                className="historyrow"
                key={r.id}
              >

                <div>

                  <b>
                    {translatedDisease}
                  </b>

                  <span>
                    {r.plant}
                    {' · '}
                    {r.confidence_percentage}%
                  </span>

                </div>


                <span>

                  {new Date(
                    r.created_at
                  ).toLocaleString()}

                </span>

              </div>

            );

          })}

        </div>

      )}

    </section>
  );
}


/* =========================================================
   WEATHER
========================================================= */

function Weather({
  t,
  language
}) {

  const [city, setCity] =
    useState('Ahmedabad');

  const [weather, setWeather] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [weatherError, setWeatherError] =
    useState('');


  /* ---------------------------------------------------------
     WEATHER TRANSLATIONS
  --------------------------------------------------------- */

  const weatherTexts = {

    en: {

      clear:
        'Clear sky',

      mainlyClear:
        'Mainly clear',

      partlyCloudy:
        'Partly cloudy',

      overcast:
        'Overcast',

      fog:
        'Fog',

      drizzle:
        'Drizzle',

      rain:
        'Rain',

      snow:
        'Snow',

      showers:
        'Rain showers',

      thunderstorm:
        'Thunderstorm',


      irrigationRain:
        'Rain is likely. Avoid unnecessary irrigation and check soil moisture first.',

      irrigationDry:
        'Rain probability is low. Irrigation may be needed if the soil is dry.',

      irrigationNormal:
        'Monitor soil moisture and irrigate according to crop requirements.',


      diseaseHigh:
        'High humidity/rain conditions may increase fungal disease risk. Monitor leaves closely.',

      diseaseModerate:
        'Weather conditions may support some disease development. Inspect crops regularly.',

      diseaseLow:
        'Current weather indicates relatively lower disease pressure, but continue regular monitoring.',


      sprayWind:
        'Strong winds are present. Avoid spraying pesticides or foliar products now.',

      sprayRain:
        'Rain is likely. Avoid spraying because rainfall can reduce treatment effectiveness.',

      sprayGood:
        'Weather is more suitable for spraying, but always follow the product label and local agricultural guidance.'

    },


    hi: {

      clear:
        'साफ आसमान',

      mainlyClear:
        'मुख्यतः साफ',

      partlyCloudy:
        'आंशिक बादल',

      overcast:
        'बादल छाए हुए',

      fog:
        'कोहरा',

      drizzle:
        'बूंदाबांदी',

      rain:
        'बारिश',

      snow:
        'बर्फबारी',

      showers:
        'बारिश की बौछार',

      thunderstorm:
        'गरज के साथ बारिश',


      irrigationRain:
        'बारिश की संभावना है। अनावश्यक सिंचाई से बचें और पहले मिट्टी की नमी जांचें।',

      irrigationDry:
        'बारिश की संभावना कम है। यदि मिट्टी सूखी है तो सिंचाई की आवश्यकता हो सकती है।',

      irrigationNormal:
        'मिट्टी की नमी पर नजर रखें और फसल की आवश्यकता के अनुसार सिंचाई करें।',


      diseaseHigh:
        'अधिक नमी या बारिश से फंगल रोग का जोखिम बढ़ सकता है। पत्तियों की नियमित जांच करें।',

      diseaseModerate:
        'मौसम कुछ रोगों के विकास में सहायक हो सकता है। फसल की नियमित जांच करें।',

      diseaseLow:
        'वर्तमान मौसम में रोग का जोखिम अपेक्षाकृत कम है, फिर भी नियमित निगरानी जारी रखें।',


      sprayWind:
        'हवा तेज है। अभी कीटनाशक या पत्तियों पर स्प्रे करने से बचें।',

      sprayRain:
        'बारिश की संभावना है। अभी स्प्रे करने से बचें क्योंकि बारिश उपचार की प्रभावशीलता कम कर सकती है।',

      sprayGood:
        'मौसम स्प्रे के लिए अधिक उपयुक्त है, लेकिन हमेशा उत्पाद के लेबल और स्थानीय कृषि सलाह का पालन करें।'

    },


    gu: {

      clear:
        'સાફ આકાશ',

      mainlyClear:
        'મુખ્યત્વે સાફ',

      partlyCloudy:
        'આંશિક વાદળછાયું',

      overcast:
        'વાદળછાયું',

      fog:
        'ધુમ્મસ',

      drizzle:
        'ઝરમર વરસાદ',

      rain:
        'વરસાદ',

      snow:
        'બરફવર્ષા',

      showers:
        'વરસાદની ઝાપટ',

      thunderstorm:
        'ગાજવીજ સાથે વરસાદ',


      irrigationRain:
        'વરસાદની શક્યતા છે. અનાવશ્યક સિંચાઈ ટાળો અને પહેલા જમીનની ભેજ તપાસો.',

      irrigationDry:
        'વરસાદની શક્યતા ઓછી છે. જો જમીન સૂકી હોય તો સિંચાઈની જરૂર પડી શકે છે.',

      irrigationNormal:
        'જમીનની ભેજ પર નજર રાખો અને પાકની જરૂરિયાત મુજબ સિંચાઈ કરો.',


      diseaseHigh:
        'વધુ ભેજ અથવા વરસાદથી ફૂગના રોગનું જોખમ વધી શકે છે. પાંદડાની નિયમિત તપાસ કરો.',

      diseaseModerate:
        'હવામાન કેટલાક રોગોના વિકાસ માટે અનુકૂળ હોઈ શકે છે. પાકની નિયમિત તપાસ કરો.',

      diseaseLow:
        'હાલના હવામાનમાં રોગનું જોખમ પ્રમાણમાં ઓછું છે, તેમ છતાં નિયમિત દેખરેખ રાખો.',


      sprayWind:
        'પવનની ઝડપ વધારે છે. હાલમાં જંતુનાશક અથવા પાંદડા પર સ્પ્રે કરવાનું ટાળો.',

      sprayRain:
        'વરસાદની શક્યતા છે. હાલમાં સ્પ્રે કરવાનું ટાળો કારણ કે વરસાદ સારવારની અસરકારકતા ઘટાડી શકે છે.',

      sprayGood:
        'હવામાન સ્પ્રે માટે વધુ યોગ્ય છે, પરંતુ હંમેશા ઉત્પાદનના લેબલ અને સ્થાનિક કૃષિ સલાહનું પાલન કરો.'

    }

  };


  const wt =
    weatherTexts[language];


  /* ---------------------------------------------------------
     WEATHER CONDITION
  --------------------------------------------------------- */

  const getCondition =
    (code) => {

      if (code === 0)
        return wt.clear;

      if (code === 1)
        return wt.mainlyClear;

      if (code === 2)
        return wt.partlyCloudy;

      if (code === 3)
        return wt.overcast;

      if (
        [45, 48]
          .includes(code)
      )
        return wt.fog;

      if (
        [51, 53, 55, 56, 57]
          .includes(code)
      )
        return wt.drizzle;

      if (
        [61, 63, 65, 66, 67]
          .includes(code)
      )
        return wt.rain;

      if (
        [71, 73, 75, 77]
          .includes(code)
      )
        return wt.snow;

      if (
        [80, 81, 82]
          .includes(code)
      )
        return wt.showers;

      if (
        [95, 96, 99]
          .includes(code)
      )
        return wt.thunderstorm;

      return wt.mainlyClear;
    };


  /* ---------------------------------------------------------
     FETCH WEATHER
  --------------------------------------------------------- */

  const getWeather =
    async () => {

      if (!city.trim()) {

        setWeatherError(
          t.enterCityMessage
        );

        return;
      }


      setLoading(true);

      setWeatherError('');


      try {

        /* GEOCODING */

        const geoUrl =
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            city.trim()
          )}&count=1&language=en&format=json`;


        const geoResponse =
          await fetch(
            geoUrl
          );


        if (!geoResponse.ok) {
          throw new Error(
            'Geocoding failed'
          );
        }


        const geoData =
          await geoResponse.json();


        if (
          !geoData.results ||
          geoData.results.length === 0
        ) {

          setWeatherError(
            t.weatherNotFound
          );

          setLoading(false);

          return;
        }


        const location =
          geoData.results[0];


        /* WEATHER API */

        const weatherUrl =
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}` +
          `&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code` +
          `&hourly=precipitation_probability,rain,relative_humidity_2m,temperature_2m,wind_speed_10m,weather_code` +
          `&daily=precipitation_probability_max,temperature_2m_max,temperature_2m_min,rain_sum,weather_code` +
          `&timezone=auto&forecast_days=3`;


        const weatherResponse =
          await fetch(
            weatherUrl
          );


        if (!weatherResponse.ok) {

          throw new Error(
            'Weather request failed'
          );

        }


        const weatherData =
          await weatherResponse.json();


        /* FIND CURRENT HOUR */

        const currentTime =
          weatherData.current?.time;


        let hourIndex = 0;


        if (
          currentTime &&
          weatherData.hourly?.time
        ) {

          const exactIndex =
            weatherData.hourly.time
              .indexOf(
                currentTime
              );


          if (exactIndex >= 0) {

            hourIndex =
              exactIndex;

          }

        }


        /* RAW VALUES */

        const temperature =
          weatherData.current
            ?.temperature_2m ?? 0;


        const humidity =
          weatherData.current
            ?.relative_humidity_2m ?? 0;


        const wind =
          weatherData.current
            ?.wind_speed_10m ?? 0;


        const precipitation =
          weatherData.current
            ?.precipitation ?? 0;


        const rainProbability =
          weatherData.hourly
            ?.precipitation_probability
            ?.[hourIndex] ??

          weatherData.daily
            ?.precipitation_probability_max
            ?.[0] ??

          0;


        const weatherCode =
          weatherData.current
            ?.weather_code ?? 0;


        /* ---------------------------------------------------
           IRRIGATION LOGIC
        --------------------------------------------------- */

        let irrigationType;


        if (
          rainProbability >= 60
        ) {

          irrigationType =
            'rain';

        } else if (
          rainProbability <= 20 &&
          temperature >= 30
        ) {

          irrigationType =
            'dry';

        } else {

          irrigationType =
            'normal';

        }


        /* ---------------------------------------------------
           DISEASE RISK LOGIC
        --------------------------------------------------- */

        let diseaseType;


        if (
          humidity >= 80 ||
          rainProbability >= 60
        ) {

          diseaseType =
            'high';

        } else if (
          humidity >= 65 ||
          rainProbability >= 35
        ) {

          diseaseType =
            'moderate';

        } else {

          diseaseType =
            'low';

        }


        /* ---------------------------------------------------
           SPRAYING LOGIC
        --------------------------------------------------- */

        let sprayType;


        if (wind >= 25) {

          sprayType =
            'wind';

        } else if (
          rainProbability >= 50
        ) {

          sprayType =
            'rain';

        } else {

          sprayType =
            'good';

        }


        /* ---------------------------------------------------
           STORE RAW VALUES + TYPES
        --------------------------------------------------- */

        setWeather({

          city:
            location.name,

          country:
            location.country,

          temperature,

          humidity,

          wind,

          precipitation,

          rainProbability,

          weatherCode,

          irrigationType,

          diseaseType,

          sprayType

        });

      } catch (error) {

        console.error(
          error
        );

        setWeatherError(
          t.weatherError
        );

      } finally {

        setLoading(false);

      }

    };


  /* ---------------------------------------------------------
     IMPORTANT:
     WEATHER TEXT IS GENERATED FROM THE CURRENT LANGUAGE.
     Therefore changing language automatically updates
     the complete suggestions without another API call.
  --------------------------------------------------------- */

  const translatedCondition =
    weather
      ? getCondition(
          weather.weatherCode
        )
      : '';


  const translatedIrrigation =
    weather
      ? weather.irrigationType === 'rain'
        ? wt.irrigationRain

        : weather.irrigationType === 'dry'
          ? wt.irrigationDry

          : wt.irrigationNormal

      : '';


  const translatedDisease =
    weather
      ? weather.diseaseType === 'high'
        ? wt.diseaseHigh

        : weather.diseaseType === 'moderate'
          ? wt.diseaseModerate

          : wt.diseaseLow

      : '';


  const translatedSpraying =
    weather
      ? weather.sprayType === 'wind'
        ? wt.sprayWind

        : weather.sprayType === 'rain'
          ? wt.sprayRain

          : wt.sprayGood

      : '';


  const diseaseRiskLevel =
    weather
      ? weather.diseaseType === 'high'
        ? t.high

        : weather.diseaseType === 'moderate'
          ? t.moderate

          : t.low

      : '';


  /* ---------------------------------------------------------
     WEATHER UI
  --------------------------------------------------------- */

  return (

    <section>

      <h2>
        🌦️ {t.weatherTitle}
      </h2>


      <p>
        {t.weatherSubtitle}
      </p>


      <div className="upload">

        <input
          type="text"
          value={city}
          placeholder={
            t.enterCity
          }

          onChange={(e) =>
            setCity(
              e.target.value
            )
          }
        />


        <button
          className="primary"

          onClick={
            getWeather
          }

          disabled={
            loading
          }
        >

          {loading
            ? t.searchingWeather
            : '🌤️ ' +
              t.searchWeather}

        </button>

      </div>


      {weatherError && (

        <div className="error">
          {weatherError}
        </div>

      )}


      {weather && (

        <div className="result">


          <h2>

            📍 {weather.city}

            {weather.country
              ? `, ${weather.country}`
              : ''}

          </h2>


          <p>

            <b>
              {t.condition}:
            </b>{' '}

            {translatedCondition}

          </p>


          <div className="grid">


            <div className="stat">

              <b>
                🌡️ {t.temperature}
              </b>

              <h2>
                {Math.round(
                  weather.temperature
                )}°C
              </h2>

            </div>


            <div className="stat">

              <b>
                💧 {t.humidity}
              </b>

              <h2>
                {Math.round(
                  weather.humidity
                )}%
              </h2>

            </div>


            <div className="stat">

              <b>
                🌧️ {t.rainProbability}
              </b>

              <h2>
                {Math.round(
                  weather.rainProbability
                )}%
              </h2>

            </div>


            <div className="stat">

              <b>
                💨 {t.windSpeed}
              </b>

              <h2>
                {Math.round(
                  weather.wind
                )}{' '}
                km/h
              </h2>

            </div>

          </div>


          <div className="two">


            <div>

              <h3>
                💦 {t.irrigationAdvice}
              </h3>

              <p>
                {translatedIrrigation}
              </p>

            </div>


            <div>

              <h3>
                🦠 {t.diseaseRisk}
              </h3>

              <p>

                <b>
                  {diseaseRiskLevel}
                </b>

                <br />

                {translatedDisease}

              </p>

            </div>

          </div>


          <div className="two">


            <div>

              <h3>
                🧪 {t.sprayingAdvice}
              </h3>

              <p>
                {translatedSpraying}
              </p>

            </div>


            <div>

              <h3>
                🌱 {t.aiDetection}
              </h3>

              <p>
                {t.combineWeather}
              </p>

            </div>

          </div>


          <small>
            {t.weatherSource}
          </small>


        </div>

      )}

    </section>
  );
}


/* =========================================================
   START REACT APPLICATION
========================================================= */

createRoot(
  document.getElementById('root')
).render(
  <App />
);