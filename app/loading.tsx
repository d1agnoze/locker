const Loading = () => {
    return (<div className="absolute min-h-screen w-screen flex bg-opacity-60 hero-overlay justify-center items-center left-0 z-10 top-0">
        <span className="loading loading-spinner loading-lg"></span>
    </div>);
}

export default Loading;