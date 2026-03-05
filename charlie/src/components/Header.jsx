import React from 'react'

export default function Header() {
  return (
    <header className="max-w-4xl mx-auto">
      <div className="bg-accent-light w-full h-20">
        <div className="flex items-center justify-between size-full max-w-2xl mx-auto px-6">
          <a href="/" className="text-gray-900 hover:opacity-80 transition-opacity">
            <svg height="28" viewBox="0 0 977 402" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <title>subway</title>
              <path fillRule="evenodd" clipRule="evenodd" d="M544.249 332.102C557.499 332.102 560.191 327.3 557.499 318.3C546.037 279.971 552.874 241.432 567.853 205.191C573.136 191.5 583.695 188.115 587.401 187.101C588.904 186.69 589.96 186.401 590.587 185.38C597.439 174.21 602.659 164.39 606.173 155.067C606.615 153.894 605.847 152.623 604.598 152.521C591.087 151.418 580.111 158.464 573.136 163.73C570.467 153.889 562.537 148.122 553.541 146.862C545.479 145.733 537.115 145.714 535.358 149.043C533.676 152.23 535.358 154.8 541.522 166.789C545.127 173.8 544.92 178.789 539.496 187.786C515.256 228 506.5 284.3 522.166 330.404C522.35 331.328 523.164 331.997 524.107 332.002L544.249 332.102ZM269.947 268.402C264.996 294.311 265.522 336.029 265.808 348.456C265.855 350.467 265.213 351.719 262.31 352.31C254.525 353.896 237.126 354.446 231.018 354.594C229.847 354.623 228.917 353.648 229.001 352.48C229.459 346.109 232.392 312.932 234.5 292.801C232 292.801 230 308.382 225.5 313.301C190.16 351.926 160.582 361.08 135.367 356.261C113.83 352.145 84.6651 333.266 94.4771 281.917C111.299 193.889 171 162.412 206.841 168.951C230.498 173.267 246.806 183.592 246.806 183.592C242.809 193.425 239.632 208.046 237.853 217.361C237.142 221.084 232.432 222.697 229.498 220.301C222.108 214.265 213.72 207.332 202.299 205.15C167.47 198.494 131.839 252.932 124.614 285.767C117.557 317.684 133.012 323.805 141.434 324.472C179.372 327.862 212.846 282.08 244.832 237.157C258.211 181.1 273 140.301 303.5 92.8011C312.796 78.3231 337.711 56.8011 354.296 53.5061C361.845 52.0061 363.337 52.1811 370.171 52.6361C378.33 53.1791 379.105 56.5401 373.953 61.7921C351.577 84.6041 312.908 128.697 295.055 174.59C293.114 179.579 286.94 193.607 288 193.801C289.06 193.994 291.9 188.447 292.671 186.727C301.524 166.991 332.52 156.329 351.012 159.863C372.245 163.921 380.985 190.2 370.073 207.639C356.591 229.185 353.47 244.68 350.72 258.719C345.789 283.904 346.04 310.91 350.694 335.887C351.723 341.409 347.718 346.022 342.131 346.581L314.154 349.382C313.063 349.491 312.088 348.709 311.974 347.619C307.413 303.905 311.337 247.874 337.71 198.454C338.919 196.654 338.417 194.129 336.358 193.451C319.443 187.883 299.331 211.988 273.684 249.662C272.35 256.028 271.116 262.287 269.947 268.402ZM529.227 169.805C530.786 173.522 531.228 176.041 529.227 179.804C505.999 212.803 499.976 241.305 497.648 269.364C494.956 301.801 497.733 321.532 498.648 330.357C498.756 331.4 497.996 332.284 496.954 332.402L484.647 333.802C467.476 335.8 468.727 315.8 466.227 314.3C464.491 313.259 461.727 325.279 457.287 327.8C442.107 336.42 422.141 339.872 409.583 337.782C389.1 334.372 358.582 314.887 366.704 266.099C380.626 182.463 435.813 149.259 469.892 154.639C479.393 156.139 483.753 157.616 490.347 160.129C492.87 161.09 494.499 163.803 493.499 173.303C494.401 171.725 502.297 154.912 503.229 153.302C511.172 139.573 522.726 154.301 529.227 169.805ZM481.503 194.771C476.49 192.006 471.255 189.785 466.415 188.979C433.291 183.465 403.311 238.146 397.219 269.364C392.703 292.5 407 305.166 414.902 305.683C430.475 306.702 450.465 298.337 464.252 285.202C465.106 278.763 464.943 272.165 466.252 264.301C468.668 235.828 472.895 213.852 481.503 194.771ZM706.604 112.637C710.599 106.412 714.788 101.864 727.918 97.6169C743 92.7389 763.251 96.2209 746.038 119.831C741.795 125.651 741.418 126.859 739.373 128.954C738.479 129.869 737.284 130.445 736.025 130.675C707.427 135.896 696.462 128.439 706.604 112.637ZM904.115 294.59C904.281 293.261 905.666 292.449 906.885 293.002C916.59 297.401 935.18 307.351 942.5 324.104C949 342.802 952.54 369.941 922.53 348.226C906.514 336.635 895.365 337.515 898.503 324.108C901.278 312.25 902.77 305.373 904.115 294.59ZM803.55 234.587C841.987 210.976 852.219 152.693 798.56 142.903C763.271 136.159 711.663 174.744 692.285 253.923C682.293 256.28 677.016 256.177 674.78 251.628C671.23 244.407 677.937 223.057 685.002 208.297C699.838 177.299 708 170.799 723.002 151.797C730 142.933 713.408 141.355 699.838 145.493C680.145 151.498 667.502 168.797 654.502 193.797C643.816 214.347 635.781 237.69 633.999 251.63C630.477 279.174 652.186 285.309 663.739 283.936C672.43 282.904 680.428 281.993 688.088 280.943C687.842 308.56 701.836 330.386 721.313 342.124C732.909 349.112 745.966 341.057 756.401 332.433C782.448 310.908 816.044 314.67 842.717 319.468C843.709 319.646 844.656 319.073 844.958 318.144C845.017 317.964 845.066 317.789 845.147 317.618C848.115 311.345 852.313 294.596 852.313 279.499C852.404 278.475 851.694 277.552 850.681 277.376C814.377 271.058 780.286 275.638 740.908 307.116C739.402 308.32 737.411 308.916 735.632 308.172C726.039 304.163 718.807 293.373 721.569 273.39C728.334 272.387 734.072 270.687 743.146 267.021C764.418 258.427 787.825 245.937 803.55 234.587ZM727.896 241.533C735.072 238.636 742.368 235.594 749.401 232.734C767.55 225.355 783.5 216.692 792.736 205.28C800.69 193.554 803.384 179.887 792.201 177.75C764.247 172.408 740.323 211.53 727.896 241.533ZM712.972 53.158C709.895 26.273 703.201 0.546593 652.904 0.00399346C618.426 -0.368007 579.007 25.306 572.395 53.355C565.638 90.393 590.717 109.892 617.812 114.835C625.254 116.193 634.481 116.001 644.189 114.319C601.476 180.307 585.953 214.609 582.002 249.285C576.45 298.011 609 326.5 637.495 331.286C654 333.5 667 335.5 683.449 337.186L683.468 337.19C688.327 338.37 692.913 333.912 690.636 329.308C684.52 316.94 677.5 303.788 652.033 301.017C633.5 299 612.288 286.047 616.145 251.424C619.79 218.693 637.017 180.85 697.147 88.883C722.647 81.434 755.667 74.963 789.557 81.438C826.768 88.548 843.501 92.561 882.229 97.801C893.646 99.346 899.863 97.223 906.196 95.06C909.849 93.813 913.54 92.552 918.29 91.974C882.58 129.49 877.072 175.004 870.066 232.892C867.511 253.999 864.758 276.751 860.269 301.36C849.296 361.511 813.842 370.598 767.386 363.777C753.878 361.793 740.454 359.315 726.558 356.749C695.822 351.075 662.778 344.974 621.415 342.862C533.393 338.367 436.962 347.808 348.499 356.47C254.363 365.687 169.249 374.02 112.889 363.738C84.573 358.572 68.847 341.895 61.535 331.358C58.197 326.548 52.291 323.631 46.603 325.018L1.54539 335.274C0.220992 335.597 -0.410507 337.114 0.287793 338.285C0.567793 338.755 0.853092 339.236 1.14509 339.729C10.7488 355.936 30.619 384.405 103.457 397.693C146.072 405.468 208.447 399.497 290.011 391.689C378.008 383.264 488.34 372.702 620.287 374.957C656.503 375.576 687.942 381.932 716.553 387.717C727.113 389.852 737.288 391.909 747.176 393.571C823.641 406.424 876.935 397.977 895.219 297.76C898.033 282.336 899.578 266.854 901.139 251.219C907.298 189.505 921.95 118.463 973.76 77.436C977.45 74.512 976.45 68.902 972.09 67.077C959.81 61.932 946.64 54.566 933.16 60.108C919.55 65.706 895.893 68.605 882.229 65.995C853.372 60.481 824.741 53.85 795.883 48.337C778.921 45.096 740.674 46.011 712.972 53.158ZM648.003 26.863C681.594 25.338 683.199 45.551 670.287 69.673C656.841 80.379 633.217 85.585 621.735 83.491C610.254 81.396 601.666 73.815 604.168 60.097C607.755 40.435 633.743 27.51 648.003 26.863Z"></path>
            </svg>
          </a>
          <nav className="flex items-center gap-6 text-gray-700">
            <a className="text-sm hover:text-gray-900 transition-colors" href="#about">About</a>
            <a className="text-sm hover:text-gray-900 transition-colors" href="#work">Work</a>
            <a className="text-sm hover:text-gray-900 transition-colors" href="#contact">Contact</a>
          </nav>
        </div>
      </div>
      <svg className="w-full" viewBox="0 0 1920 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1920" y="80" width="40" height="40" transform="rotate(180 1920 80)" fill="#E2F4FF"></rect>
        <rect x="1920" y="40" width="40" height="40" transform="rotate(180 1920 40)" fill="#E2F4FF"></rect>
        <rect x="1440" y="80" width="40" height="40" transform="rotate(180 1440 80)" fill="#E2F4FF"></rect>
        <rect x="1440" y="40" width="40" height="40" transform="rotate(180 1440 40)" fill="#E2F4FF"></rect>
        <rect x="1680" y="80" width="40" height="40" transform="rotate(180 1680 80)" fill="#E2F4FF"></rect>
        <rect x="1680" y="40" width="40" height="40" transform="rotate(180 1680 40)" fill="#E2F4FF"></rect>
        <rect x="1200" y="80" width="40" height="40" transform="rotate(180 1200 80)" fill="#E2F4FF"></rect>
        <rect x="1200" y="40" width="40" height="40" transform="rotate(180 1200 40)" fill="#E2F4FF"></rect>
        <rect x="1800" y="80" width="40" height="40" transform="rotate(180 1800 80)" fill="#E2F4FF"></rect>
        <rect x="1800" y="40" width="40" height="40" transform="rotate(180 1800 40)" fill="#E2F4FF"></rect>
        <rect x="1320" y="80" width="40" height="40" transform="rotate(180 1320 80)" fill="#E2F4FF"></rect>
        <rect x="1320" y="40" width="40" height="40" transform="rotate(180 1320 40)" fill="#E2F4FF"></rect>
        <rect x="1560" y="80" width="40" height="40" transform="rotate(180 1560 80)" fill="#E2F4FF"></rect>
        <rect x="1560" y="40" width="40" height="40" transform="rotate(180 1560 40)" fill="#E2F4FF"></rect>
        <rect x="1080" y="80" width="40" height="40" transform="rotate(180 1080 80)" fill="#E2F4FF"></rect>
        <rect x="1080" y="40" width="40" height="40" transform="rotate(180 1080 40)" fill="#E2F4FF"></rect>
        <rect x="1840" y="80" width="40" height="40" transform="rotate(180 1840 80)" fill="#E2F4FF"></rect>
        <rect x="1840" y="40" width="40" height="40" transform="rotate(180 1840 40)" fill="#E2F4FF"></rect>
        <rect x="1360" y="40" width="40" height="40" transform="rotate(180 1360 40)" fill="#E2F4FF"></rect>
        <rect x="1600" y="80" width="40" height="40" transform="rotate(180 1600 80)" fill="#E2F4FF"></rect>
        <rect x="1600" y="40" width="40" height="40" transform="rotate(180 1600 40)" fill="#E2F4FF"></rect>
        <rect x="1120" y="80" width="40" height="40" transform="rotate(180 1120 80)" fill="#E2F4FF"></rect>
        <rect x="1120" y="40" width="40" height="40" transform="rotate(180 1120 40)" fill="#E2F4FF"></rect>
        <rect x="1720" y="40" width="40" height="40" transform="rotate(180 1720 40)" fill="#E2F4FF"></rect>
        <rect x="1240" y="80" width="40" height="40" transform="rotate(180 1240 80)" fill="#E2F4FF"></rect>
        <rect x="1240" y="40" width="40" height="40" transform="rotate(180 1240 40)" fill="#E2F4FF"></rect>
        <rect x="1480" y="80" width="40" height="40" transform="rotate(180 1480 80)" fill="#E2F4FF"></rect>
        <rect x="1480" y="40" width="40" height="40" transform="rotate(180 1480 40)" fill="#E2F4FF"></rect>
        <rect x="1000" y="80" width="40" height="40" transform="rotate(180 1000 80)" fill="#E2F4FF"></rect>
        <rect x="1000" y="40" width="40" height="40" transform="rotate(180 1000 40)" fill="#E2F4FF"></rect>
        <rect x="1880" y="80" width="40" height="40" transform="rotate(180 1880 80)" fill="#E2F4FF"></rect>
        <rect x="1880" y="40" width="40" height="40" transform="rotate(180 1880 40)" fill="#E2F4FF"></rect>
        <rect x="1400" y="40" width="40" height="40" transform="rotate(180 1400 40)" fill="#E2F4FF"></rect>
        <rect x="1640" y="80" width="40" height="40" transform="rotate(180 1640 80)" fill="#E2F4FF"></rect>
        <rect x="1640" y="40" width="40" height="40" transform="rotate(180 1640 40)" fill="#E2F4FF"></rect>
        <rect x="1160" y="80" width="40" height="40" transform="rotate(180 1160 80)" fill="#E2F4FF"></rect>
        <rect x="1160" y="40" width="40" height="40" transform="rotate(180 1160 40)" fill="#E2F4FF"></rect>
        <rect x="1760" y="80" width="40" height="40" transform="rotate(180 1760 80)" fill="#E2F4FF"></rect>
        <rect x="1760" y="40" width="40" height="40" transform="rotate(180 1760 40)" fill="#E2F4FF"></rect>
        <rect x="1280" y="80" width="40" height="40" transform="rotate(180 1280 80)" fill="#E2F4FF"></rect>
        <rect x="1280" y="40" width="40" height="40" transform="rotate(180 1280 40)" fill="#E2F4FF"></rect>
        <rect x="1520" y="80" width="40" height="40" transform="rotate(180 1520 80)" fill="#E2F4FF"></rect>
        <rect x="1520" y="40" width="40" height="40" transform="rotate(180 1520 40)" fill="#E2F4FF"></rect>
        <rect x="1040" y="80" width="40" height="40" transform="rotate(180 1040 80)" fill="#E2F4FF"></rect>
        <rect x="1040" y="40" width="40" height="40" transform="rotate(180 1040 40)" fill="#E2F4FF"></rect>
        <rect x="960" y="80" width="40" height="40" transform="rotate(180 960 80)" fill="#E2F4FF"></rect>
        <rect x="960" y="40" width="40" height="40" transform="rotate(180 960 40)" fill="#E2F4FF"></rect>
        <rect x="480" y="80" width="40" height="40" transform="rotate(180 480 80)" fill="#E2F4FF"></rect>
        <rect x="480" y="40" width="40" height="40" transform="rotate(180 480 40)" fill="#E2F4FF"></rect>
        <rect x="720" y="40" width="40" height="40" transform="rotate(180 720 40)" fill="#E2F4FF"></rect>
        <rect x="240" y="80" width="40" height="40" transform="rotate(180 240 80)" fill="#E2F4FF"></rect>
        <rect x="240" y="40" width="40" height="40" transform="rotate(180 240 40)" fill="#E2F4FF"></rect>
        <rect x="840" y="80" width="40" height="40" transform="rotate(180 840 80)" fill="#E2F4FF"></rect>
        <rect x="840" y="40" width="40" height="40" transform="rotate(180 840 40)" fill="#E2F4FF"></rect>
        <rect x="360" y="80" width="40" height="40" transform="rotate(180 360 80)" fill="#E2F4FF"></rect>
        <rect x="360" y="40" width="40" height="40" transform="rotate(180 360 40)" fill="#E2F4FF"></rect>
        <rect x="600" y="80" width="40" height="40" transform="rotate(180 600 80)" fill="#E2F4FF"></rect>
        <rect x="600" y="40" width="40" height="40" transform="rotate(180 600 40)" fill="#E2F4FF"></rect>
        <rect x="120" y="80" width="40" height="40" transform="rotate(180 120 80)" fill="#E2F4FF"></rect>
        <rect x="120" y="40" width="40" height="40" transform="rotate(180 120 40)" fill="#E2F4FF"></rect>
        <rect x="880" y="80" width="40" height="40" transform="rotate(180 880 80)" fill="#E2F4FF"></rect>
        <rect x="880" y="40" width="40" height="40" transform="rotate(180 880 40)" fill="#E2F4FF"></rect>
        <rect x="400" y="80" width="40" height="40" transform="rotate(180 400 80)" fill="#E2F4FF"></rect>
        <rect x="400" y="40" width="40" height="40" transform="rotate(180 400 40)" fill="#E2F4FF"></rect>
        <rect x="640" y="80" width="40" height="40" transform="rotate(180 640 80)" fill="#E2F4FF"></rect>
        <rect x="640" y="40" width="40" height="40" transform="rotate(180 640 40)" fill="#E2F4FF"></rect>
        <rect x="160" y="80" width="40" height="40" transform="rotate(180 160 80)" fill="#E2F4FF"></rect>
        <rect x="160" y="40" width="40" height="40" transform="rotate(180 160 40)" fill="#E2F4FF"></rect>
        <rect x="760" y="80" width="40" height="40" transform="rotate(180 760 80)" fill="#E2F4FF"></rect>
        <rect x="760" y="40" width="40" height="40" transform="rotate(180 760 40)" fill="#E2F4FF"></rect>
        <rect x="280" y="80" width="40" height="40" transform="rotate(180 280 80)" fill="#E2F4FF"></rect>
        <rect x="280" y="40" width="40" height="40" transform="rotate(180 280 40)" fill="#E2F4FF"></rect>
        <rect x="520" y="80" width="40" height="40" transform="rotate(180 520 80)" fill="#E2F4FF"></rect>
        <rect x="520" y="40" width="40" height="40" transform="rotate(180 520 40)" fill="#E2F4FF"></rect>
        <rect x="40" y="80" width="40" height="40" transform="rotate(180 40 80)" fill="#E2F4FF"></rect>
        <rect x="40" y="40" width="40" height="40" transform="rotate(180 40 40)" fill="#E2F4FF"></rect>
        <rect x="920" y="80" width="40" height="40" transform="rotate(180 920 80)" fill="#E2F4FF"></rect>
        <rect x="920" y="40" width="40" height="40" transform="rotate(180 920 40)" fill="#E2F4FF"></rect>
        <rect x="440" y="80" width="40" height="40" transform="rotate(180 440 80)" fill="#E2F4FF"></rect>
        <rect x="440" y="40" width="40" height="40" transform="rotate(180 440 40)" fill="#E2F4FF"></rect>
        <rect x="680" y="80" width="40" height="40" transform="rotate(180 680 80)" fill="#E2F4FF"></rect>
        <rect x="680" y="40" width="40" height="40" transform="rotate(180 680 40)" fill="#E2F4FF"></rect>
        <rect x="200" y="80" width="40" height="40" transform="rotate(180 200 80)" fill="#E2F4FF"></rect>
        <rect x="200" y="40" width="40" height="40" transform="rotate(180 200 40)" fill="#E2F4FF"></rect>
        <rect x="800" y="80" width="40" height="40" transform="rotate(180 800 80)" fill="#E2F4FF"></rect>
        <rect x="800" y="40" width="40" height="40" transform="rotate(180 800 40)" fill="#E2F4FF"></rect>
        <rect x="320" y="80" width="40" height="40" transform="rotate(180 320 80)" fill="#E2F4FF"></rect>
        <rect x="320" y="40" width="40" height="40" transform="rotate(180 320 40)" fill="#E2F4FF"></rect>
        <rect x="560" y="80" width="40" height="40" transform="rotate(180 560 80)" fill="#E2F4FF"></rect>
        <rect x="560" y="40" width="40" height="40" transform="rotate(180 560 40)" fill="#E2F4FF"></rect>
        <rect x="80" y="80" width="40" height="40" transform="rotate(180 80 80)" fill="#E2F4FF"></rect>
        <rect x="80" y="40" width="40" height="40" transform="rotate(180 80 40)" fill="#E2F4FF"></rect>
        <rect x="1880" y="80" width="40" height="40" transform="rotate(180 1880 80)" fill="#F2FAFF"></rect>
        <rect x="1880" y="120" width="40" height="40" transform="rotate(180 1880 120)" fill="#F2FAFF"></rect>
        <rect x="1640" y="120" width="40" height="40" transform="rotate(180 1640 120)" fill="#F2FAFF"></rect>
        <rect x="1240" y="120" width="40" height="40" transform="rotate(180 1240 120)" fill="#F2FAFF"></rect>
        <rect x="1040" y="120" width="40" height="40" transform="rotate(180 1040 120)" fill="#F2FAFF"></rect>
        <rect x="1760" y="120" width="40" height="40" transform="rotate(180 1760 120)" fill="#F2FAFF"></rect>
        <rect x="1520" y="120" width="40" height="40" transform="rotate(180 1520 120)" fill="#F2FAFF"></rect>
        <rect x="1320" y="120" width="40" height="40" transform="rotate(180 1320 120)" fill="#F2FAFF"></rect>
        <rect x="1120" y="120" width="40" height="40" transform="rotate(180 1120 120)" fill="#F2FAFF"></rect>
        <rect x="1560" y="80" width="40" height="40" transform="rotate(180 1560 80)" fill="#F2FAFF"></rect>
        <rect x="1160" y="80" width="40" height="40" transform="rotate(180 1160 80)" fill="#F2FAFF"></rect>
        <rect x="1520" y="40" width="40" height="40" transform="rotate(180 1520 40)" fill="#F2FAFF"></rect>
        <rect x="1320" y="40" width="40" height="40" transform="rotate(180 1320 40)" fill="#F2FAFF"></rect>
        <rect x="1680" y="40" width="40" height="40" transform="rotate(180 1680 40)" fill="#F2FAFF"></rect>
        <rect x="1800" y="40" width="40" height="40" transform="rotate(180 1800 40)" fill="#F2FAFF"></rect>
        <rect x="1840" y="40" width="40" height="40" transform="rotate(180 1840 40)" fill="#F2FAFF"></rect>
        <rect x="1800" y="80" width="40" height="40" transform="rotate(180 1800 80)" fill="#F2FAFF"></rect>
        <rect x="1280" y="40" width="40" height="40" transform="rotate(180 1280 40)" fill="#F2FAFF"></rect>
        <rect x="1920" y="120" width="40" height="40" transform="rotate(180 1920 120)" fill="#F2FAFF"></rect>
        <rect x="1680" y="120" width="40" height="40" transform="rotate(180 1680 120)" fill="#F2FAFF"></rect>
        <rect x="1480" y="120" width="40" height="40" transform="rotate(180 1480 120)" fill="#F2FAFF"></rect>
        <rect x="1280" y="120" width="40" height="40" transform="rotate(180 1280 120)" fill="#F2FAFF"></rect>
        <rect x="1080" y="120" width="40" height="40" transform="rotate(180 1080 120)" fill="#F2FAFF"></rect>
        <rect x="1800" y="120" width="40" height="40" transform="rotate(180 1800 120)" fill="#F2FAFF"></rect>
        <rect x="1560" y="120" width="40" height="40" transform="rotate(180 1560 120)" fill="#F2FAFF"></rect>
        <rect x="1360" y="120" width="40" height="40" transform="rotate(180 1360 120)" fill="#F2FAFF"></rect>
        <rect x="1160" y="120" width="40" height="40" transform="rotate(180 1160 120)" fill="#F2FAFF"></rect>
        <rect x="1840" y="80" width="40" height="40" transform="rotate(180 1840 80)" fill="#F2FAFF"></rect>
        <rect x="1840" y="120" width="40" height="40" transform="rotate(180 1840 120)" fill="#F2FAFF"></rect>
        <rect x="1600" y="120" width="40" height="40" transform="rotate(180 1600 120)" fill="#F2FAFF"></rect>
        <rect x="1640" y="160" width="40" height="40" transform="rotate(180 1640 160)" fill="#F2FAFF"></rect>
        <rect x="1400" y="120" width="40" height="40" transform="rotate(180 1400 120)" fill="#F2FAFF"></rect>
        <rect x="1200" y="120" width="40" height="40" transform="rotate(180 1200 120)" fill="#F2FAFF"></rect>
        <rect x="1000" y="120" width="40" height="40" transform="rotate(180 1000 120)" fill="#F2FAFF"></rect>
        <rect x="1720" y="120" width="40" height="40" transform="rotate(180 1720 120)" fill="#F2FAFF"></rect>
        <rect x="1560" y="40" width="40" height="40" transform="rotate(180 1560 40)" fill="#F2FAFF"></rect>
        <rect x="1360" y="40" width="40" height="40" transform="rotate(180 1360 40)" fill="#F2FAFF"></rect>
        <rect x="1160" y="40" width="40" height="40" transform="rotate(180 1160 40)" fill="#F2FAFF"></rect>
        <rect x="1400" y="40" width="40" height="40" transform="rotate(180 1400 40)" fill="#F2FAFF"></rect>
        <rect x="1640" y="40" width="40" height="40" transform="rotate(180 1640 40)" fill="#F2FAFF"></rect>
        <rect x="1640" y="80" width="40" height="40" transform="rotate(180 1640 80)" fill="#F2FAFF"></rect>
        <rect x="1440" y="80" width="40" height="40" transform="rotate(180 1440 80)" fill="#F2FAFF"></rect>
        <rect x="1240" y="80" width="40" height="40" transform="rotate(180 1240 80)" fill="#F2FAFF"></rect>
        <rect x="1040" y="80" width="40" height="40" transform="rotate(180 1040 80)" fill="#F2FAFF"></rect>
        <rect x="1520" y="80" width="40" height="40" transform="rotate(180 1520 80)" fill="#F2FAFF"></rect>
        <rect x="1320" y="80" width="40" height="40" transform="rotate(180 1320 80)" fill="#F2FAFF"></rect>
        <rect x="1120" y="80" width="40" height="40" transform="rotate(180 1120 80)" fill="#F2FAFF"></rect>
        <rect x="1680" y="80" width="40" height="40" transform="rotate(180 1680 80)" fill="#F2FAFF"></rect>
        <rect x="1280" y="80" width="40" height="40" transform="rotate(180 1280 80)" fill="#F2FAFF"></rect>
        <rect x="1760" y="80" width="40" height="40" transform="rotate(180 1760 80)" fill="#F2FAFF"></rect>
        <rect x="1600" y="80" width="40" height="40" transform="rotate(180 1600 80)" fill="#F2FAFF"></rect>
        <rect x="1200" y="80" width="40" height="40" transform="rotate(180 1200 80)" fill="#F2FAFF"></rect>
        <rect x="1000" y="80" width="40" height="40" transform="rotate(180 1000 80)" fill="#F2FAFF"></rect>
        <rect x="920" y="80" width="40" height="40" transform="rotate(180 920 80)" fill="#F2FAFF"></rect>
        <rect x="920" y="120" width="40" height="40" transform="rotate(180 920 120)" fill="#F2FAFF"></rect>
        <rect x="680" y="120" width="40" height="40" transform="rotate(180 680 120)" fill="#F2FAFF"></rect>
        <rect x="480" y="120" width="40" height="40" transform="rotate(180 480 120)" fill="#F2FAFF"></rect>
        <rect x="280" y="120" width="40" height="40" transform="rotate(180 280 120)" fill="#F2FAFF"></rect>
        <rect x="80" y="120" width="40" height="40" transform="rotate(180 80 120)" fill="#F2FAFF"></rect>
        <rect x="800" y="120" width="40" height="40" transform="rotate(180 800 120)" fill="#F2FAFF"></rect>
        <rect x="560" y="120" width="40" height="40" transform="rotate(180 560 120)" fill="#F2FAFF"></rect>
        <rect x="360" y="120" width="40" height="40" transform="rotate(180 360 120)" fill="#F2FAFF"></rect>
        <rect x="160" y="120" width="40" height="40" transform="rotate(180 160 120)" fill="#F2FAFF"></rect>
        <rect x="600" y="80" width="40" height="40" transform="rotate(180 600 80)" fill="#F2FAFF"></rect>
        <rect x="400" y="80" width="40" height="40" transform="rotate(180 400 80)" fill="#F2FAFF"></rect>
        <rect x="200" y="80" width="40" height="40" transform="rotate(180 200 80)" fill="#F2FAFF"></rect>
        <rect x="760" y="80" width="40" height="40" transform="rotate(180 760 80)" fill="#F2FAFF"></rect>
        <rect x="560" y="40" width="40" height="40" transform="rotate(180 560 40)" fill="#F2FAFF"></rect>
        <rect x="360" y="40" width="40" height="40" transform="rotate(180 360 40)" fill="#F2FAFF"></rect>
        <rect x="720" y="40" width="40" height="40" transform="rotate(180 720 40)" fill="#F2FAFF"></rect>
        <rect x="840" y="40" width="40" height="40" transform="rotate(180 840 40)" fill="#F2FAFF"></rect>
        <rect x="880" y="40" width="40" height="40" transform="rotate(180 880 40)" fill="#F2FAFF"></rect>
        <rect x="840" y="80" width="40" height="40" transform="rotate(180 840 80)" fill="#F2FAFF"></rect>
        <rect x="320" y="40" width="40" height="40" transform="rotate(180 320 40)" fill="#F2FAFF"></rect>
        <rect x="960" y="120" width="40" height="40" transform="rotate(180 960 120)" fill="#F2FAFF"></rect>
        <rect x="920" y="160" width="40" height="40" transform="rotate(180 920 160)" fill="#F2FAFF"></rect>
        <rect x="720" y="120" width="40" height="40" transform="rotate(180 720 120)" fill="#F2FAFF"></rect>
        <rect x="520" y="120" width="40" height="40" transform="rotate(180 520 120)" fill="#F2FAFF"></rect>
        <rect x="320" y="120" width="40" height="40" transform="rotate(180 320 120)" fill="#F2FAFF"></rect>
        <rect x="120" y="120" width="40" height="40" transform="rotate(180 120 120)" fill="#F2FAFF"></rect>
        <rect x="840" y="120" width="40" height="40" transform="rotate(180 840 120)" fill="#F2FAFF"></rect>
        <rect x="400" y="120" width="40" height="40" transform="rotate(180 400 120)" fill="#F2FAFF"></rect>
        <rect x="200" y="120" width="40" height="40" transform="rotate(180 200 120)" fill="#F2FAFF"></rect>
        <rect x="880" y="80" width="40" height="40" transform="rotate(180 880 80)" fill="#F2FAFF"></rect>
        <rect x="880" y="120" width="40" height="40" transform="rotate(180 880 120)" fill="#F2FAFF"></rect>
        <rect x="640" y="120" width="40" height="40" transform="rotate(180 640 120)" fill="#F2FAFF"></rect>
        <rect x="440" y="120" width="40" height="40" transform="rotate(180 440 120)" fill="#F2FAFF"></rect>
        <rect x="440" y="160" width="40" height="40" transform="rotate(180 440 160)" fill="#F2FAFF"></rect>
        <rect x="240" y="120" width="40" height="40" transform="rotate(180 240 120)" fill="#F2FAFF"></rect>
        <rect x="40" y="120" width="40" height="40" transform="rotate(180 40 120)" fill="#F2FAFF"></rect>
        <rect x="760" y="120" width="40" height="40" transform="rotate(180 760 120)" fill="#F2FAFF"></rect>
        <rect x="600" y="40" width="40" height="40" transform="rotate(180 600 40)" fill="#F2FAFF"></rect>
        <rect x="400" y="40" width="40" height="40" transform="rotate(180 400 40)" fill="#F2FAFF"></rect>
        <rect x="200" y="40" width="40" height="40" transform="rotate(180 200 40)" fill="#F2FAFF"></rect>
        <rect x="440" y="40" width="40" height="40" transform="rotate(180 440 40)" fill="#F2FAFF"></rect>
        <rect x="680" y="40" width="40" height="40" transform="rotate(180 680 40)" fill="#F2FAFF"></rect>
        <rect x="680" y="80" width="40" height="40" transform="rotate(180 680 80)" fill="#F2FAFF"></rect>
        <rect x="480" y="80" width="40" height="40" transform="rotate(180 480 80)" fill="#F2FAFF"></rect>
        <rect x="280" y="80" width="40" height="40" transform="rotate(180 280 80)" fill="#F2FAFF"></rect>
        <rect x="80" y="80" width="40" height="40" transform="rotate(180 80 80)" fill="#F2FAFF"></rect>
        <rect x="560" y="80" width="40" height="40" transform="rotate(180 560 80)" fill="#F2FAFF"></rect>
        <rect x="360" y="80" width="40" height="40" transform="rotate(180 360 80)" fill="#F2FAFF"></rect>
        <rect x="160" y="80" width="40" height="40" transform="rotate(180 160 80)" fill="#F2FAFF"></rect>
        <rect x="320" y="80" width="40" height="40" transform="rotate(180 320 80)" fill="#F2FAFF"></rect>
        <rect x="800" y="80" width="40" height="40" transform="rotate(180 800 80)" fill="#F2FAFF"></rect>
        <rect x="640" y="80" width="40" height="40" transform="rotate(180 640 80)" fill="#F2FAFF"></rect>
        <rect x="440" y="80" width="40" height="40" transform="rotate(180 440 80)" fill="#F2FAFF"></rect>
        <rect x="240" y="80" width="40" height="40" transform="rotate(180 240 80)" fill="#F2FAFF"></rect>
        <rect x="40" y="80" width="40" height="40" transform="rotate(180 40 80)" fill="#F2FAFF"></rect>
        <rect x="1840" y="120" width="40" height="40" transform="rotate(180 1840 120)" fill="white"></rect>
        <rect x="1520" y="120" width="40" height="40" transform="rotate(180 1520 120)" fill="white"></rect>
        <rect x="1200" y="120" width="40" height="40" transform="rotate(180 1200 120)" fill="white"></rect>
        <rect x="1680" y="120" width="40" height="40" transform="rotate(180 1680 120)" fill="white"></rect>
        <rect x="1360" y="120" width="40" height="40" transform="rotate(180 1360 120)" fill="white"></rect>
        <rect x="1880" y="120" width="40" height="40" transform="rotate(180 1880 120)" fill="white"></rect>
        <rect x="1240" y="120" width="40" height="40" transform="rotate(180 1240 120)" fill="white"></rect>
        <rect x="1720" y="120" width="40" height="40" transform="rotate(180 1720 120)" fill="white"></rect>
        <rect x="1480" y="120" width="40" height="40" transform="rotate(180 1480 120)" fill="white"></rect>
        <rect x="1640" y="120" width="40" height="40" transform="rotate(180 1640 120)" fill="white"></rect>
        <rect x="1320" y="120" width="40" height="40" transform="rotate(180 1320 120)" fill="white"></rect>
        <rect x="1000" y="120" width="40" height="40" transform="rotate(180 1000 120)" fill="white"></rect>
        <rect x="880" y="120" width="40" height="40" transform="rotate(180 880 120)" fill="white"></rect>
        <rect x="560" y="120" width="40" height="40" transform="rotate(180 560 120)" fill="white"></rect>
        <rect x="240" y="120" width="40" height="40" transform="rotate(180 240 120)" fill="white"></rect>
        <rect x="720" y="120" width="40" height="40" transform="rotate(180 720 120)" fill="white"></rect>
        <rect x="400" y="120" width="40" height="40" transform="rotate(180 400 120)" fill="white"></rect>
        <rect x="280" y="120" width="40" height="40" transform="rotate(180 280 120)" fill="white"></rect>
        <rect x="760" y="120" width="40" height="40" transform="rotate(180 760 120)" fill="white"></rect>
        <rect x="520" y="120" width="40" height="40" transform="rotate(180 520 120)" fill="white"></rect>
        <rect x="680" y="120" width="40" height="40" transform="rotate(180 680 120)" fill="white"></rect>
        <rect x="360" y="120" width="40" height="40" transform="rotate(180 360 120)" fill="white"></rect>
        <rect x="40" y="120" width="40" height="40" transform="rotate(180 40 120)" fill="white"></rect>
      </svg>
    </header>
  )
}
