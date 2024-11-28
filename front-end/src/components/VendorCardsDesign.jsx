import React, { useState, useMemo, useEffect, useCallback } from 'react';
import UnsplashImages from './UnsplashImages';

const VendorCardsDesign = () => {
    return (
        <div className='vendor-card-design-card'>
            <div className='vendor-card-design-cardImage'>
                <UnsplashImages
                    query={vendorData.business_name}
                    numberOfImages={'1'}
                    randomPage={'1'}
                />
            </div>
            <div className='vendor-card-design-cardInfo'>

            </div>

        </div>
    )
}

export default VendorCardsDesign
