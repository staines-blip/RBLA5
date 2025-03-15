import React from 'react';
import { useWishlist } from '../../Context/WishlistContext';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const WishlistButton = ({ productId, size = 'medium' }) => {
    const { addToWishlist, removeFromWishlist, isInWishlist, loading } = useWishlist();
    const inWishlist = isInWishlist(productId);

    const handleToggleWishlist = async (e) => {
        e.stopPropagation(); // Prevent event bubbling
        if (loading) return;
        
        if (inWishlist) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    };

    return (
        <Tooltip title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}>
            <IconButton
                onClick={handleToggleWishlist}
                disabled={loading}
                color={inWishlist ? "error" : "default"}
                size={size}
                sx={{
                    '&:hover': {
                        color: '#ff1744',
                    }
                }}
            >
                {inWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
        </Tooltip>
    );
};

export default WishlistButton;
