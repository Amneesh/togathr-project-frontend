
import React from 'react'

const BannerLandingPage = ({ images, speed = 10000 }) => {
    return (
        <div className="banner-landing-page">
            <div className="inner">
                <div className="wrapper">
                    <section style={{ "--speed": `${speed}ms` }}>
                        {images.map(({ id, image }) => (
                            <div className="image" key={id}>
                                <img src={image} alt={id} />
                            </div>
                        ))}
                    </section>
                    <section style={{ "--speed": `${speed}ms` }}>
                        {images.map(({ id, image }) => (
                            <div className="imageScroll" key={id}>
                                <img src={image} alt={id} />
                            </div>
                        ))}
                    </section>
                    <section style={{ "--speed": `${speed}ms` }}>
                        {images.map(({ id, image }) => (
                            <div className="imageScroll" key={id}>
                                <img src={image} alt={id} />
                            </div>
                        ))}
                    </section>
                    <section style={{ "--speed": `${speed}ms` }}>
                        {images.map(({ id, image }) => (
                            <div className="imageScroll" key={id}>
                                <img src={image} alt={id} />
                            </div>
                        ))}
                    </section>
                    <section style={{ "--speed": `${speed}ms` }}>
                        {images.map(({ id, image }) => (
                            <div className="imageScroll" key={id}>
                                <img src={image} alt={id} />
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </div>
    );
}

export default BannerLandingPage
