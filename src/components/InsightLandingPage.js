// import React from 'react';
// import { Brain, Sparkles } from 'lucide-react';
// import {useNavigate} from 'react-router-dom';

// const InsightLandingPage = () => {
//     const navigate=useNavigate();
//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 50%, #f3f0ff 100%)',
//       position: 'relative',
//       overflow: 'hidden'
//     }}>
//       {/* Transparent White Overlay */}
//       <div style={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(255, 255, 255, 0.4)',
//         backdropFilter: 'blur(10px)'
//       }}></div>
      
//       {/* Background Decoration */}
//       <div style={{
//         position: 'absolute',
//         top: '10%',
//         left: '5%',
//         width: '150px',
//         height: '150px',
//         background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
//         borderRadius: '50%',
//         filter: 'blur(40px)',
//         animation: 'pulse 4s ease-in-out infinite'
//       }}></div>
      
//       <div style={{
//         position: 'absolute',
//         bottom: '15%',
//         right: '8%',
//         width: '200px',
//         height: '200px',
//         background: 'linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))',
//         borderRadius: '50%',
//         filter: 'blur(50px)',
//         animation: 'pulse 6s ease-in-out infinite'
//       }}></div>
      
//       {/* Logo in Top Left */}
//       <div style={{
//         position: 'absolute',
//         top: '32px',
//         left: '32px',
//         zIndex: 20,
//         display: 'flex',
//         alignItems: 'center',
//         gap: '12px'
//       }}>
//         <div style={{ position: 'relative' }}>
//           <Brain size={32} color="#2563eb" />
//           <div style={{
//             position: 'absolute',
//             top: '-4px',
//             right: '-4px'
//           }}>
//             <Sparkles size={16} color="#7c3aed" />
//           </div>
//         </div>
//         <h1 style={{
//           fontSize: '24px',
//           fontWeight: '700',
//           background: 'linear-gradient(135deg, #2563eb, #7c3aed, #1d4ed8)',
//           WebkitBackgroundClip: 'text',
//           WebkitTextFillColor: 'transparent',
//           backgroundClip: 'text',
//           margin: 0
//         }}>
//           Insight.AI
//         </h1>
//       </div>

//       {/* Main Content */}
//       <div style={{
//         position: 'relative',
//         zIndex: 10,
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center'
//       }}>
//         <div style={{
//           textAlign: 'center',
//           maxWidth: '900px',
//           padding: '0 32px'
//         }}>
//           {/* Main Question */}
//           <div style={{ position: 'relative', marginBottom: '48px' }}>
//             <h2 style={{
//               fontSize: 'clamp(3rem, 8vw, 6rem)',
//               fontWeight: '200',
//               color: 'rgba(31, 41, 55, 0.9)',
//               lineHeight: '1.1',
//               letterSpacing: '-0.02em',
//               margin: 0,
//               marginBottom: '16px'
//             }}>
//             Reading made easy with 
//             </h2>
//             <h2 style={{
//               fontSize: 'clamp(3rem, 8vw, 6rem)',
//               fontWeight: '300',
//               background: 'linear-gradient(135deg, #2563eb, #7c3aed, #4338ca)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               backgroundClip: 'text',
//               lineHeight: '1.1',
//               letterSpacing: '-0.02em',
//               margin: 0,
//               marginBottom: '16px'
//             }}>
//               insight AI
//             </h2>
 
//           </div>
          
//           {/* Subtitle */}
//           <p style={{
//             fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
//             color: 'rgba(75, 85, 99, 0.8)',
//             fontWeight: '300',
//             maxWidth: '600px',
//             margin: '0 auto 48px auto',
//             lineHeight: '1.6'
//           }}>
//             Transform any document into intelligent conversations.
//             <br />
//             Upload, ask, and discover insights instantly.
//           </p>
          
//           {/* CTA Button */}
//           <button 
//           onClick={()=>{navigate('/Chat')}}
//           style={{
//             padding: '16px 48px',
//             background: 'rgba(255, 255, 255, 0.9)',
//             backdropFilter: 'blur(20px)',
//             border: '1px solid rgba(255, 255, 255, 0.5)',
//             borderRadius: '16px',
//             color: '#374151',
//             fontWeight: '500',
//             fontSize: '18px',
//             cursor: 'pointer',
//             boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
//             transition: 'all 0.3s ease',
//             display: 'inline-flex',
//             alignItems: 'center',
//             gap: '12px'
//           }}
//           onMouseEnter={(e) => {
//             e.target.style.background = 'rgba(255, 255, 255, 0.95)';
//             e.target.style.transform = 'scale(1.05)';
//             e.target.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
//           }}
//           onMouseLeave={(e) => {
//             e.target.style.background = 'rgba(255, 255, 255, 0.9)';
//             e.target.style.transform = 'scale(1)';
//             e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
//           }}>
//             Get Started
//             <div style={{
//               width: '20px',
//               height: '20px',
//               background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
//               borderRadius: '50%',
//               transition: 'transform 0.3s ease'
//             }}></div>
//           </button>
//         </div>
//       </div>

//       {/* Footer */}
//       <div style={{
//         position: 'absolute',
//         bottom: '24px',
//         left: '50%',
//         transform: 'translateX(-50%)',
//         zIndex: 20,
//         textAlign: 'center'
//       }}>
//         <p style={{
//           fontSize: '14px',
//           color: 'black',
//           fontWeight: '400',
//           margin: 0,
//           letterSpacing: '0.025em'
//         }}>
//           © 2025 Insight.AI from Muqeet
//         </p>
//       </div>

//       {/* Custom Animations */}
//       <style dangerouslySetInnerHTML={{__html: `
//         @keyframes pulse {
//           0%, 100% { opacity: 0.4; transform: scale(1); }
//           50% { opacity: 0.6; transform: scale(1.1); }
//         }
        
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-20px); }
//         }
        
//         /* Ensure gradient text works in all browsers */
//         .gradient-text {
//           background: linear-gradient(135deg, #2563eb, #7c3aed, #4338ca);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//         }
//       `}}></style>
//     </div>
//   );
// };

// export default InsightLandingPage;


import React from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InsightLandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 50%, #f3f0ff 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Transparent White Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(10px)'
      }}></div>
      
      {/* Background Decorations */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '150px',
        height: '150px',
        background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'pulse 4s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '8%',
        width: '200px',
        height: '200px',
        background: 'linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))',
        borderRadius: '50%',
        filter: 'blur(50px)',
        animation: 'pulse 6s ease-in-out infinite'
      }}></div>
      
      {/* Logo */}
      <div style={{
        position: 'absolute',
        top: '32px',
        left: '32px',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{ position: 'relative' }}>
          <Brain size={32} color="#2563eb" />
          <div style={{ position: 'absolute', top: '-4px', right: '-4px' }}>
            <Sparkles size={16} color="#7c3aed" />
          </div>
        </div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #2563eb, #7c3aed, #1d4ed8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          Insight.AI
        </h1>
      </div>

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '900px', padding: '0 32px' }}>
          {/* Main Question */}
          <div style={{ position: 'relative', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: '200',
              color: 'rgba(31, 41, 55, 0.9)',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
              margin: 0,
              marginBottom: '16px'
            }}>
              Reading made easy with
            </h2>
            <h2 style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: '300',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed, #4338ca)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
              margin: 0,
              marginBottom: '16px'
            }}>
              insight AI
            </h2>
          </div>
          
          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
            color: 'rgba(75, 85, 99, 0.8)',
            fontWeight: '300',
            maxWidth: '600px',
            margin: '0 auto 48px auto',
            lineHeight: '1.6'
          }}>
            Transform any document into intelligent conversations.
            <br />
            Upload, ask, and discover insights instantly.
          </p>
          
          {/* CTA Button */}
          <button 
            onClick={() => navigate('/chat')}
            style={{
              padding: '16px 48px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '16px',
              color: '#374151',
              fontWeight: '500',
              fontSize: '18px',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.95)';
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.9)';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
            }}
          >
            Get Started
            <div style={{
              width: '20px',
              height: '20px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '50%',
              transition: 'transform 0.3s ease'
            }}></div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '14px',
          color: 'black',
          fontWeight: '400',
          margin: 0,
          letterSpacing: '0.025em'
        }}>
          © 2025 Insight.AI from Muqeet
        </p>
      </div>

      {/* Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}}></style>
    </div>
  );
};

export default InsightLandingPage;
