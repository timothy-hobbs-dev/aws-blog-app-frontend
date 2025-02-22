const BASE_URL = 'https://api.photos-app.click';

export const api = {
  async uploadImage(file, userData, auth) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const response = await fetch(`${BASE_URL}/upload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth?.user?.id_token}`,
            },
            body: JSON.stringify({
              image: reader.result.split(',')[1],
              userId: userData["cognito:username"],
              firstName: userData?.name,
              lastName: userData.family_name,
            }),
          });
          const data = await response.json();
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsDataURL(file);
    });
  },

  async getImages(auth, params = {}) {
    console.log(auth);
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${BASE_URL}/pictures?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth?.user?.id_token}`,
      },
    });
    return response.json();
  },

  async deleteImage(imageId, auth, permanentDelete = false, restore = false) {
    const response = await fetch(`${BASE_URL}/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth?.user?.id_token}`,
      },
      body: JSON.stringify({
        imageId,
        permanentDelete,
        restore,
      }),
    });
    return response.json();
  },

  async shareImage(imageId, auth) {
    const response = await fetch(`${BASE_URL}/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth?.user?.id_token}`,
      },
      body: JSON.stringify({
        imageId,
      }),
    });
    return response.json();
  },

  async signup(signupData) {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${auth?.user?.id_token}`,
      },
      body: JSON.stringify(signupData),
    });
    return response.json();
  }
};
