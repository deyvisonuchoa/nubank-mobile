import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AnimationController, Animation, Platform, Gesture, GestureController, GestureDetail } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('blocks') blocks: ElementRef;
  @ViewChild('background') background: ElementRef;
  @ViewChild('swipeDown') swipeDown: any;

  public options: Array<any> = [
    {icon: 'person-add-outline', text: 'Indicar amigos'},
    {icon: 'phone-portrait-outline', text: 'Recarga de celular'},
    {icon: 'wallet-outline', text: 'Depositar'},
    {icon: 'options-outline', text: 'Ajustar limite'},
    {icon: 'help-circle-outline', text: 'Me ajuda'},
    {icon: 'barcode-outline', text: 'Pagar'},
    {icon: 'lock-open-outline', text: 'Bloquear cartão'},
    {icon: 'card-outline', text: 'Cartão virtual'}
  ];

  public slidesOptions: any = { 
    slidesPerView: 3, 
    freeMode: true
  };

  public items: Array<any> = [
    {icon: 'help-circle-outline', text: 'Me ajuda'},
    {icon: 'person-outline', text: 'Perfil'},
    {icon: 'cash-outline', text: 'Configurar conta'},
    {icon: 'card-outline', text: 'Configurar cartão'},
    {icon: 'phone-portrait-outline', text: 'Configurações do app'},
  ];

  public initialStep: number = 0;
  private maxTranslate:number;
  private animation: Animation;
  private gesture: Gesture;
  private swiping: boolean = false;
  

  constructor(
    private animationCtrl: AnimationController,
    private platform: Platform,
    private renderer: Renderer2,
    private gestureCtrl: GestureController
  ) {
    this.maxTranslate = this.platform.height() - 200;
  }

  ngAfterViewInit(){
    this.createAnimation();
    this.detectSwipe();
  }
  
  createAnimation() {
    this.animation = this.animationCtrl.create()
    .addElement(this.blocks.nativeElement)
    .duration(300)
    .fromTo('transform', 'translateY(0)', `translateY(${this.maxTranslate}px)`)
    .onFinish( () => this.gesture.enable(true))
  }

  detectSwipe(){
    this.gesture = this.gestureCtrl.create({
      el: this.swipeDown.el,
      gestureName: 'swipe-down',
      threshold: 0,
      onMove: evt => this.onMove(evt),
      onEnd: evt => this.onEnd(evt)
    }, true)

    this.gesture.enable(true);
  }
  
  toogleBlocks(){
    this.initialStep = this.initialStep === 0 ? this.maxTranslate : 0;
    this.gesture.enable(false);
    this.animation.direction(this.initialStep === 0 ? 'reverse' : 'normal').play();
    this.setBackgroundOpacity();
  }
  
  setBackgroundOpacity(value: number = null) {
    this.renderer.setStyle(this.background.nativeElement, 'opacity', value ? value : this.initialStep === 0 ? '0' : '1');
  }

  fixedBlocks(): boolean{
    return this.swiping || this.initialStep === this.maxTranslate;
  }

  onMove(evt: GestureDetail){
    if(!this.swiping){
      this.animation.direction('normal').progressStart(true);
      this.swiping = true;
    }

    const step: number = this.getStep(evt)
    this.animation.progressStep(step);
    this.setBackgroundOpacity(step);
  }

  getStep(evt: GestureDetail): number {
    const delta: number = this.initialStep + evt.deltaY;
    return delta/this.maxTranslate
  }

  onEnd(evt: GestureDetail){
    if(!this.swiping)
      return;
    
    this.gesture.enable(false)
      
    const step: number = this.getStep(evt)
    const shouldComplete: boolean = step > 0.5;

    this.animation.progressEnd(shouldComplete ? 1 : 0, step)

    this.initialStep = shouldComplete ? this.maxTranslate : 0;

    this.setBackgroundOpacity();

    this.swiping = false;
  }

}
