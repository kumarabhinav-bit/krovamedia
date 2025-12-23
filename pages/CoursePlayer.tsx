import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { Play, Pause, Volume2, VolumeX, Settings, Maximize, ArrowLeft, CheckCircle, ChevronRight, PlayCircle, Users, Send, MessageSquare, ArrowRight, FileText, Download } from 'lucide-react';

export const CoursePlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, updateData } = useContent();
  const { hasAccess, user, markLessonComplete } = useAuth();
  const navigate = useNavigate();
  
  const course = data.courses.find(c => c.id === id);
  const [activeLesson, setActiveLesson] = useState(course?.modules[0].lessons[0]);
  
  // Video State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [quality, setQuality] = useState('720p');
  const [showSettings, setShowSettings] = useState(false);
  
  // Comments State
  const [commentText, setCommentText] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'chat' | 'resources'>('content'); 

  // Check Access
  useEffect(() => {
    if (!course) return;
    if (!user || !hasAccess(course.id)) {
      navigate(`/courses/${course.id}`);
    } else if(!activeLesson) {
        // Set initial lesson
        if(course.modules.length > 0 && course.modules[0].lessons.length > 0) {
            setActiveLesson(course.modules[0].lessons[0]);
        }
    }
  }, [id, user, course]);

  useEffect(() => {
    if(videoRef.current) {
        videoRef.current.load();
        setIsPlaying(false);
        setSpeed(1);
    }
  }, [activeLesson]);

  if (!course || !activeLesson) return null;

  const isCompleted = user?.completedLessonIds?.includes(activeLesson.id);

  const handleMarkComplete = () => {
      markLessonComplete(activeLesson.id);
  };

  // Video Handlers
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
        videoRef.current.currentTime = val;
        setCurrentTime(val);
    }
  };

  const changeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (videoRef.current) videoRef.current.playbackRate = newSpeed;
    setShowSettings(false);
  };
  
  const changeQuality = (newQuality: string) => {
    setQuality(newQuality);
    setShowSettings(false);
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // Comment Handler
  const handlePostComment = (e: React.FormEvent) => {
      e.preventDefault();
      if(!commentText.trim() || !user) return;

      const newComment = {
          id: Date.now().toString(),
          userId: user.id,
          userName: user.name,
          text: commentText,
          timestamp: new Date().toISOString()
      };

      // We need to update the global data state to persist this comment
      // Find indexes
      const cIdx = data.courses.findIndex(c => c.id === course.id);
      if(cIdx === -1) return;
      
      const mIdx = data.courses[cIdx].modules.findIndex(m => m.lessons.some(l => l.id === activeLesson.id));
      if(mIdx === -1) return;

      const lIdx = data.courses[cIdx].modules[mIdx].lessons.findIndex(l => l.id === activeLesson.id);
      if(lIdx === -1) return;

      // Create new state structure
      const newData = {...data};
      const currentComments = newData.courses[cIdx].modules[mIdx].lessons[lIdx].comments || [];
      newData.courses[cIdx].modules[mIdx].lessons[lIdx].comments = [newComment, ...currentComments];
      
      updateData(newData); // Persist
      
      // Update local active lesson to reflect changes immediately
      setActiveLesson({
          ...activeLesson, 
          comments: [newComment, ...(activeLesson.comments || [])]
      });
      
      setCommentText('');
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 flex flex-col">
       {/* Simplified Navbar for LMS */}
       <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/courses')} className="hover:text-indigo-400">
                <ArrowLeft size={24} />
             </button>
             <h1 className="font-bold text-lg hidden md:block">{course.title}</h1>
          </div>
          <div className="flex items-center gap-4">
             {isCompleted ? (
                 <span className="text-green-500 flex items-center gap-1 text-sm font-semibold">
                     <CheckCircle size={16} /> Completed
                 </span>
             ) : (
                 <button 
                    onClick={handleMarkComplete}
                    className="text-xs border border-slate-500 px-3 py-1.5 rounded hover:bg-slate-700 transition-colors"
                 >
                    Mark Complete
                 </button>
             )}
             <div className="text-sm font-semibold text-slate-400 hidden sm:block">
                {activeLesson.type === 'live' ? <span className="text-red-500 flex items-center gap-1"><Users size={14}/> Live Class</span> : "Recorded Lesson"}
             </div>
          </div>
       </div>

       <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full overflow-y-auto">
             
             {/* Player Container */}
             <div className="bg-black w-full aspect-video relative flex flex-col justify-center items-center">
                {activeLesson.type === 'video' ? (
                    <div className="relative group w-full h-full">
                        <video 
                        ref={videoRef}
                        src={activeLesson.videoUrl}
                        className="w-full h-full"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={() => setIsPlaying(false)}
                        onClick={togglePlay}
                        />
                        
                        {/* Custom Controls Overlay */}
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {/* Timeline */}
                        <input 
                            type="range" 
                            min="0" 
                            max={duration} 
                            value={currentTime} 
                            onChange={handleSeek}
                            className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer mb-4 accent-indigo-500 hover:h-1.5 transition-all"
                        />
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button onClick={togglePlay} className="hover:text-indigo-400">
                                    {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
                                </button>
                                
                                <div className="flex items-center gap-2 group/vol">
                                    <button onClick={() => {
                                        const newVol = volume === 0 ? 1 : 0;
                                        setVolume(newVol);
                                        if(videoRef.current) videoRef.current.volume = newVol;
                                    }}>
                                    {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                    </button>
                                    <input 
                                    type="range" 
                                    min="0" 
                                    max="1" 
                                    step="0.1" 
                                    value={volume} 
                                    onChange={handleVolume}
                                    className="w-20 h-1 accent-white hidden group-hover/vol:block"
                                    />
                                </div>

                                <span className="text-xs font-mono">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 relative">
                                {/* Settings Menu */}
                                <div className="relative">
                                    <button 
                                    onClick={() => setShowSettings(!showSettings)} 
                                    className={`hover:text-indigo-400 ${showSettings ? 'text-indigo-400' : ''} transition-transform ${showSettings ? 'rotate-90' : ''}`}
                                    >
                                    <Settings size={20} />
                                    </button>
                                    
                                    {showSettings && (
                                    <div className="absolute bottom-10 right-0 bg-slate-800 rounded-lg shadow-xl p-3 w-48 border border-slate-700 z-20">
                                        <div className="mb-3">
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Speed</p>
                                            <div className="grid grid-cols-4 gap-1">
                                                {[0.5, 1, 1.5, 2].map(s => (
                                                <button 
                                                    key={s}
                                                    onClick={() => changeSpeed(s)}
                                                    className={`text-xs p-1 rounded ${speed === s ? 'bg-indigo-600' : 'bg-slate-700 hover:bg-slate-600'}`}
                                                >
                                                    {s}x
                                                </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Quality</p>
                                            <div className="grid grid-cols-3 gap-1">
                                                {['144p', '240p', '360p', '480p', '720p', '1080p'].map(q => (
                                                <button 
                                                    key={q}
                                                    onClick={() => changeQuality(q)}
                                                    className={`text-xs p-1 rounded ${quality === q ? 'bg-indigo-600' : 'bg-slate-700 hover:bg-slate-600'}`}
                                                >
                                                    {q}
                                                </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    )}
                                </div>

                                <button onClick={() => {
                                    if (document.fullscreenElement) document.exitFullscreen();
                                    else videoRef.current?.parentElement?.requestFullscreen();
                                }}>
                                    <Maximize size={20} />
                                </button>
                            </div>
                        </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-8">
                        <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users size={40} />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Live Class Session</h2>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto">
                            This lesson is a live interactive session. Please join at the scheduled time using the link below.
                        </p>
                        <a 
                           href={activeLesson.meetingUrl || "#"} 
                           target="_blank" 
                           rel="noreferrer"
                           className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all inline-flex items-center gap-2"
                        >
                            Join Meeting <ArrowRight size={20}/>
                        </a>
                    </div>
                )}
             </div>
             
             {/* Lesson Details & Comments */}
             <div className="flex-1 bg-slate-900 p-6">
                <div className="flex gap-6 mb-6 border-b border-slate-700 pb-2 overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('content')}
                        className={`pb-2 font-bold whitespace-nowrap ${activeTab === 'content' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400'}`}
                    >
                        Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('resources')}
                        className={`pb-2 font-bold whitespace-nowrap ${activeTab === 'resources' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400'}`}
                    >
                        Notes & Resources
                    </button>
                    <button 
                        onClick={() => setActiveTab('chat')}
                        className={`pb-2 font-bold whitespace-nowrap ${activeTab === 'chat' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400'}`}
                    >
                        Discussion ({activeLesson.comments?.length || 0})
                    </button>
                </div>

                {activeTab === 'content' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-2">{activeLesson.title}</h2>
                        <div className="flex gap-4 text-sm text-slate-400 mb-4">
                            {activeLesson.type === 'video' && (
                                <>
                                    <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">Quality: {quality}</span>
                                    <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">Speed: {speed}x</span>
                                </>
                            )}
                            <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">{activeLesson.duration}</span>
                        </div>
                        <p className="text-slate-400">
                            {course.shortDescription}
                        </p>
                    </div>
                )}

                {activeTab === 'resources' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg mb-4 text-white">Attached Materials</h3>
                        {activeLesson.resources && activeLesson.resources.length > 0 ? (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {activeLesson.resources.map((res) => (
                                    <a 
                                        key={res.id} 
                                        href={res.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-indigo-500 hover:bg-slate-700/50 transition-all flex items-center gap-3 group"
                                    >
                                        <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                            <FileText size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-200">{res.title}</h4>
                                            <span className="text-xs text-slate-500">Click to open</span>
                                        </div>
                                        <Download size={16} className="text-slate-500 group-hover:text-indigo-400" />
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 border border-dashed border-slate-700 rounded-lg">
                                <FileText size={32} className="mx-auto text-slate-600 mb-3" />
                                <p className="text-slate-500">No notes or resources attached to this lesson.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'chat' && (
                    <div className="flex flex-col h-96">
                        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                             {(activeLesson.comments && activeLesson.comments.length > 0) ? (
                                 activeLesson.comments.map((comment) => (
                                     <div key={comment.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                                         <div className="flex justify-between items-start mb-1">
                                             <span className="font-bold text-indigo-400 text-sm">{comment.userName}</span>
                                             <span className="text-xs text-slate-500">{new Date(comment.timestamp).toLocaleDateString()}</span>
                                         </div>
                                         <p className="text-slate-300 text-sm">{comment.text}</p>
                                     </div>
                                 ))
                             ) : (
                                 <div className="text-center text-slate-600 py-8">No comments yet. Be the first!</div>
                             )}
                        </div>
                        <form onSubmit={handlePostComment} className="relative">
                            <input 
                                value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                                className="w-full bg-slate-800 text-white rounded-lg pl-4 pr-12 py-3 border border-slate-700 focus:border-indigo-500 outline-none"
                                placeholder="Ask a question or share thoughts..."
                            />
                            <button type="submit" className="absolute right-2 top-2 p-1.5 bg-indigo-600 rounded-md text-white hover:bg-indigo-700">
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                )}
             </div>
          </div>

          {/* Sidebar Playlist */}
          <div className="w-full lg:w-96 bg-slate-800 border-l border-slate-700 overflow-y-auto h-[40vh] lg:h-auto">
             <div className="p-4 border-b border-slate-700 font-bold text-lg bg-slate-800 sticky top-0 z-10">
                Course Content
             </div>
             {course.modules.map((mod, i) => (
                <div key={mod.id}>
                   <div className="bg-slate-800/50 p-3 text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700/50">
                      Module {i+1}: {mod.title}
                   </div>
                   <div>
                      {mod.lessons.map(lesson => {
                         const isLessonCompleted = user?.completedLessonIds?.includes(lesson.id);
                         const hasResources = lesson.resources && lesson.resources.length > 0;
                         return (
                         <button
                            key={lesson.id}
                            onClick={() => setActiveLesson(lesson)}
                            className={`w-full text-left p-4 flex items-center gap-3 border-b border-slate-700 hover:bg-slate-700/50 transition-colors ${
                               activeLesson.id === lesson.id ? 'bg-indigo-900/30 border-l-4 border-l-indigo-500' : ''
                            }`}
                         >
                            {activeLesson.id === lesson.id ? (
                                <div className="text-indigo-400">
                                    {lesson.type === 'live' ? <Users size={20} className="text-red-500"/> : <PlayCircle size={20} fill="currentColor" className="opacity-20"/>}
                                </div>
                            ) : (
                                isLessonCompleted ? <CheckCircle size={20} className="text-green-500" /> : <CheckCircle size={20} className="text-slate-600" />
                            )}
                            <div className="flex-1">
                               <div className="flex items-center justify-between">
                                  <p className={`text-sm font-medium ${activeLesson.id === lesson.id ? 'text-indigo-300' : 'text-slate-300'}`}>
                                      {lesson.title}
                                  </p>
                                  {hasResources && (
                                    <span title="Resources attached">
                                      <FileText size={12} className="text-slate-500" />
                                    </span>
                                  )}
                               </div>
                               <div className="flex items-center gap-2 mt-1">
                                   {lesson.type === 'live' && <span className="text-[10px] bg-red-900/50 text-red-400 px-1 rounded uppercase font-bold">Live</span>}
                                   <span className="text-xs text-slate-500">{lesson.duration}</span>
                               </div>
                            </div>
                         </button>
                      )})}
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};