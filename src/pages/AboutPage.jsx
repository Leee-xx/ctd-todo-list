export default function AboutPage() {
  return(
    <>
      <h1>About this app</h1>
      <p>
        This app offers to-do list functionality that allows users to mark
        items as completed and keyword filtering. It also supports user
        authentication and React Routing (including protected routes).
      </p>

      <p>This app was built using the following technologies:</p>
      <ul>
        <li>React <span className='app-version'>v19.2</span></li>
        <li>React Router <span className='app-version'>v7.17</span></li>
        <li>Vite <span className='app-version'>v8.0</span></li>
        <li>Bootstrap <span className='app-version'>v5.3</span></li>
        <li>React Bootstrap <span className='app-version'>v2.10</span></li>
      </ul>
    </>
  )
}
