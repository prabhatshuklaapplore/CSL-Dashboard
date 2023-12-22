import toast from 'react-hot-toast'

export const toastMessage = (message, type) => {
	toast(message, {
		hideProgressBar: true,
		type: type,
		position: 'bottom-center',
		pauseOnHover: false,
	})
}
