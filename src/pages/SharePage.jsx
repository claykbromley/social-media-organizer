import React, { useEffect } from 'react';

function SharePage() {
  useEffect(() => {
    const handleSharedData = async () => {
      const formData = new FormData();
      const urlParams = new URLSearchParams(window.location.search);

      formData.append('title', urlParams.get('title') || '');
      formData.append('text', urlParams.get('text') || '');
      formData.append('url', urlParams.get('url') || '');

      console.log('Received shared data:', {
        title: formData.get('title'),
        text: formData.get('text'),
        url: formData.get('url'),
      });

      // You can save this data to your local storage or API
    };

    handleSharedData();
  }, []);

  return (
    <div>
      <h1>Post Shared Successfully!</h1>
      <p>The shared post has been added to your organizer.</p>
    </div>
  );
}

export default SharePage;
