import { useState, useEffect, useMemo, useReducer } from 'react'
import { ChevronLeft, ChevronRight, X, Edit, Trash2 } from '../config/icons'
import { useMoods } from '../hooks/useMoods'
import { DEFAULT_DATE_RANGE } from '../utils/dateRangeUtils'

const moodColors = {
  5: '#10B981', // Amazing - green
  4: '#84CC16', // Good - lime
  3: '#F59E0B', // Okay - amber
  2: '#F97316', // Low - orange
  1: '#EF4444', // Struggling - red
}

const moodLabels = {
  5: 'Amazing',
  4: 'Good', 
  3: 'Okay',
  2: 'Low',
  1: 'Struggling'
}

const initialCalendarState = {
  view: 'week',
  currentDate: new Date(),
  selectedDay: null,
  showModal: false
}

const calendarReducer = (state, action) => {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload }
    case 'SET_CURRENT_DATE':
      return { ...state, currentDate: action.payload }
    case 'NAVIGATE_DATE':
      const newDate = new Date(state.currentDate)
      if (state.view === 'week') {
        newDate.setDate(newDate.getDate() + (action.payload * 7))
      } else {
        newDate.setMonth(newDate.getMonth() + action.payload)
      }
      return { ...state, currentDate: newDate }
    case 'SELECT_DAY':
      return { 
        ...state, 
        selectedDay: action.payload ? { date: action.payload.date, mood: action.payload.mood } : null,
        showModal: !!action.payload
      }
    case 'CLOSE_MODAL':
      return { ...state, showModal: false, selectedDay: null }
    default:
      return state
  }
}

function MoodCalendar() {
  const [calendarState, dispatch] = useReducer(calendarReducer, initialCalendarState)
  const { moods, loading } = useMoods('all') // Load all mood data for calendar navigation

  // Memoize date calculations
  const weekDates = useMemo(() => getWeekDates(calendarState.currentDate), [calendarState.currentDate])
  const monthDates = useMemo(() => getMonthDates(calendarState.currentDate), [calendarState.currentDate])
  const weekRange = useMemo(() => {
    const start = weekDates[0]
    const end = weekDates[6]
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  }, [weekDates])
  const monthYear = useMemo(() => 
    calendarState.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    [calendarState.currentDate]
  )

  const getWeekDates = (date) => {
    const week = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)
    
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek)
      weekDate.setDate(startOfWeek.getDate() + i)
      week.push(weekDate)
    }
    return week
  }

  const getMonthDates = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const dates = []
    const current = new Date(startDate)
    
    while (dates.length < 42) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return dates
  }

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0]
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSameMonth = (date, referenceDate) => {
    return date.getMonth() === referenceDate.getMonth() && 
           date.getFullYear() === referenceDate.getFullYear()
  }

  const navigateWeek = (direction) => {
    dispatch({ type: 'NAVIGATE_DATE', payload: direction })
  }

  const navigateMonth = (direction) => {
    dispatch({ type: 'NAVIGATE_DATE', payload: direction })
  }

  const handleDayClick = (date) => {
    const dateKey = formatDateKey(date)
    const dayMood = moods[dateKey]
    if (dayMood) {
      dispatch({ type: 'SELECT_DAY', payload: { date, mood: dayMood } })
    }
  }

  const deleteMood = async () => {
    if (calendarState.selectedDay) {
      const dateKey = formatDateKey(calendarState.selectedDay.date)
      // TODO: Add delete functionality to useMoods hook
      const updatedMoods = { ...moods }
      delete updatedMoods[dateKey]
      localStorage.setItem('space4u_moods', JSON.stringify(updatedMoods))
      dispatch({ type: 'CLOSE_MODAL' })
    }
  }



  if (loading) {
    return (
      <div className="card p-6 mb-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const hasAnyMoods = Object.keys(moods).length > 0

  if (!hasAnyMoods) {
    return (
      <div className="card p-6 mb-6 text-center dark:bg-gray-800 dark:border-gray-700">
        <div className="text-4xl mb-4">
        <h3 className="text-xl font-semibold text-text-primary dark:text-white mb-2">Your Mood History</h3>
        <p className="text-text-secondary dark:text-gray-300 mb-4">Start tracking your mood to see patterns over time</p>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-6 py-2 bg-primary dark:bg-primary-light text-white rounded-xl font-medium hover:bg-primary/90 dark:hover:bg-primary-light/90 transition-colors"
        >
          Log your first mood
        </button>
      </div>
      </div>
    )
  }

  return (
    <>
      <div className="card p-6 mb-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-text-primary dark:text-white">
            Your Mood This {calendarState.view === 'week' ? 'Week' : 'Month'}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'week' })}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                calendarState.view === 'week' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'month' })}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                calendarState.view === 'month' ? 'bg-primary text-white' : 'text-text-secondary hover:text-primary'
              }`}
            >
              Month
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => dispatch({ type: 'NAVIGATE_DATE', payload: -1 })}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-medium text-text-primary">
            {calendarState.view === 'week' ? weekRange : monthYear}
          </span>
          <button
            onClick={() => dispatch({ type: 'NAVIGATE_DATE', payload: 1 })}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {calendarState.view === 'week' ? (
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const dateKey = formatDateKey(date)
              const dayMood = moods[dateKey]
              const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
              
              return (
                <div key={index} className="text-center">
                  <div className="text-xs text-text-secondary mb-1">{dayNames[index]}</div>
                  <div className="text-sm font-medium mb-2">{date.getDate()}</div>
                  <button
                    onClick={() => handleDayClick(date)}
                    className={`w-full h-16 rounded-xl flex items-center justify-center text-2xl transition-all hover:scale-105 ${
                      isToday(date) ? 'ring-2 ring-primary' : ''
                    } ${
                      dayMood 
                        ? 'cursor-pointer shadow-sm' 
                        : 'border-2 border-dashed border-gray-300 cursor-default'
                    }`}
                    style={{
                      backgroundColor: dayMood ? `${moodColors[dayMood.mood]}20` : 'transparent'
                    }}
                    disabled={!dayMood}
                  >
                    {dayMood ? dayMood.emoji : ''}
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-text-secondary p-2">
                {day}
              </div>
            ))}
            {monthDates.map((date, index) => {
              const dateKey = formatDateKey(date)
              const dayMood = moods[dateKey]
              const isCurrentMonth = isSameMonth(date, calendarState.currentDate)
              
              return (
                <button
                  key={index}
                  onClick={() => handleDayClick(date)}
                  className={`aspect-square p-1 rounded-lg text-sm transition-all hover:scale-105 ${
                    isToday(date) ? 'ring-2 ring-primary' : ''
                  } ${
                    !isCurrentMonth ? 'text-gray-300' : 'text-text-primary'
                  } ${
                    dayMood ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  style={{
                    backgroundColor: dayMood ? `${moodColors[dayMood.mood]}20` : 'transparent'
                  }}
                  disabled={!dayMood}
                >
                  <div className="font-medium">{date.getDate()}</div>
                  {dayMood && (
                    <div className="text-lg leading-none">{dayMood.emoji}</div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {calendarState.showModal && calendarState.selectedDay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {calendarState.selectedDay.date.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <button
                onClick={() => dispatch({ type: 'CLOSE_MODAL' })}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{calendarState.selectedDay.mood.emoji}</div>
              <p className="text-lg font-medium text-text-primary">
                You felt {moodLabels[calendarState.selectedDay.mood.mood]}
              </p>
            </div>
            
            {calendarState.selectedDay.mood.note && (
              <div className="bg-gray-50 rounded-xl p-3 mb-4">
                <p className="text-text-secondary text-sm">{calendarState.selectedDay.mood.note}</p>
              </div>
            )}
            
            <p className="text-xs text-text-secondary mb-4">
              Logged at {new Date(calendarState.selectedDay.mood.timestamp).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </p>
            
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={deleteMood}
                className="flex items-center justify-center gap-2 py-2 px-4 bg-danger text-white rounded-xl font-medium hover:bg-danger/90 transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MoodCalendar
