import { ColorRing } from 'react-loader-spinner'

const Loading = function () {
  return (
    <>
      <div className="m-5">
        <ColorRing
          height="45"
          width="45"
          colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
          ariaLabel="loading"
        />
      </div>
    </>
  )
}

export default Loading
