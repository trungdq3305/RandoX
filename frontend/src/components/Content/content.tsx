import './content.css'

interface ContentProps {
  title: string
  btnContent?: string
  linkURL?: string
}

export default function Content({ title, btnContent, linkURL }: ContentProps) {

  return (
    <div className='contentBar'>
      <h1>{title}</h1>

      {btnContent && linkURL && (
        <button
          className='todo-button'
        >
          {btnContent}
        </button>
      )}
    </div>
  )
}
