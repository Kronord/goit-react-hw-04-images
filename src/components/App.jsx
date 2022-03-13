import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { Triangle } from 'react-loader-spinner';
import ImageGallery from './ImageGallery/ImageGallery';
import apiService from './services/ImgApi';
import Button from './Button/Button';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { SRLWrapper } from 'simple-react-lightbox';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const App = () => {
  const [data, setData] = useState(null);
  const [imgName, setImgName] = useState('');
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('idle');
  const [total, setTotal] = useState(null);

  useEffect(() => {
    if (!imgName) {
      return;
    }
    if (page <= 1) {
      setStatus('pending');
    }
    apiService(imgName, page)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        const hits = data.hits;
        if (hits.length === 0) {
          setData(hits);
          setPage(1);
          setTotal(data.totalHits);
          setStatus('resolved');
          return toast.error(`Sorry we don't have image by tag ${imgName}`);
        }

        if (page > 1) {
          setData(prevState => [...prevState, ...hits]);
          setStatus('resolved');
          return;
        }

        setData(hits);
        setTotal(data.totalHits);
        setStatus('resolved');
      })
      .catch(error => {
        setError(error);
        setStatus('rejected');
      });
  }, [imgName, page]);

  const handleFormSubmit = name => {
    if (imgName.toLowerCase() === name.toLowerCase()) {
      return toast.warning('This name is already entered');
    }
    setImgName(name);
    setPage(1);
  };

  if (status === 'idle') {
    return <Searchbar onSubmit={handleFormSubmit} />;
  }

  if (status === 'pending') {
    return (
      <>
        <Searchbar onSubmit={handleFormSubmit} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '150px',
          }}
        >
          <Triangle color="#00BFFF" height={200} width={200} />
        </div>
      </>
    );
  }

  if (status === 'resolved') {
    return (
      <>
        <Searchbar onSubmit={handleFormSubmit} />
        <SRLWrapper>
          <ImageGallery data={data} />
        </SRLWrapper>
        {data.length < total && (
          <Button
            text="Load more"
            onClick={() => setPage(prevState => prevState + 1)}
          />
        )}
        <ToastContainer />
      </>
    );
  }

  if (status === 'rejected') {
    return <h1>{error}</h1>;
  }
};
