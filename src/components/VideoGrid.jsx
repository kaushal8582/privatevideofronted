import VideoCard from './VideoCard.jsx';

export default function VideoGrid({ videos, onDelete, deletingId }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {videos.map((video) => {
        const id = video.id || video._id;
        return (
          <VideoCard
            key={id}
            video={video}
            onDelete={onDelete}
            deleting={deletingId === id}
          />
        );
      })}
    </div>
  );
}
