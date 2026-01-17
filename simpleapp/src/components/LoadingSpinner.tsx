export default function LoadingSpinner() {
  return (
    <div className='flex items-center justify-center'>
      <div className='relative w-12 h-12'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-spin'></div>
        <div className='absolute inset-1 bg-white dark:bg-gray-900 rounded-full'></div>
      </div>
    </div>
  );
}
