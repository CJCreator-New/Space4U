function Card({ children, hover = true, className = '', onClick, ...props }) {
  return (
    <div
      {...props}
      onClick={onClick}
      className={`
        card
        ${hover ? 'hover-lift cursor-pointer' : ''}
        ${onClick ? 'active:scale-[0.98]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default Card
