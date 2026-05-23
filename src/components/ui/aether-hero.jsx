import React, { useEffect, useRef } from 'react';

/* Default fragment shader — aurora/kaleidoscope pattern */
const DEFAULT_FRAG = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
#define FC gl_FragCoord.xy
#define R resolution
#define T time
#define S smoothstep
#define MN min(R.x,R.y)
float pattern(vec2 uv) {
  float d=.0;
  for (float i=.0; i<3.; i++) {
    uv.x+=sin(T*(1.+i)+uv.y*1.5)*.2;
    d+=.005/abs(uv.x);
  }
  return d;	
}
vec3 scene(vec2 uv) {
  vec3 col=vec3(0);
  uv=vec2(atan(uv.x,uv.y)*2./6.28318,-log(length(uv))+T);
  for (float i=.0; i<3.; i++) {
    int k=int(mod(i,3.));
    col[k]+=pattern(uv+i*6./MN);
  }
  return col;
}
void main() {
  vec2 uv=(FC-.5*R)/MN;
  vec3 col=vec3(0);
  float s=12., e=9e-4;
  col+=e/(sin(uv.x*s)*cos(uv.y*s));
  uv.y+=R.x>R.y?.5:.5*(R.y/R.x);
  col+=scene(uv);
  O=vec4(col,1.);
}`;

const VERT_SRC = `#version 300 es
precision highp float;
in vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }
`;

const compileShader = (gl, src, type) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(sh) || 'Unknown shader error';
        gl.deleteShader(sh);
        throw new Error(info);
    }
    return sh;
};

const createProgram = (gl, vs, fs) => {
    const v = compileShader(gl, vs, gl.VERTEX_SHADER);
    const f = compileShader(gl, fs, gl.FRAGMENT_SHADER);
    const prog = gl.createProgram();
    gl.attachShader(prog, v);
    gl.attachShader(prog, f);
    gl.linkProgram(prog);
    gl.deleteShader(v);
    gl.deleteShader(f);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(prog) || 'Program link error';
        gl.deleteProgram(prog);
        throw new Error(info);
    }
    return prog;
};

const AetherHero = ({
    fragmentSource = DEFAULT_FRAG,
    dprMax = 2,
    clearColor = [0, 0, 0, 1],
    overlayGradient = 'linear-gradient(180deg, #00000099, #00000040 40%, transparent)',
    height = '100vh',
    className = '',
    ariaLabel = 'Animated hero background',
    children,
}) => {
    const canvasRef = useRef(null);
    const glRef = useRef(null);
    const programRef = useRef(null);
    const bufRef = useRef(null);
    const uniTimeRef = useRef(null);
    const uniResRef = useRef(null);
    const rafRef = useRef(null);

    const [cc0, cc1, cc2, cc3] = clearColor;

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl2', { alpha: true, antialias: true });
        if (!gl) return;
        glRef.current = gl;

        let prog;
        try {
            prog = createProgram(gl, VERT_SRC, fragmentSource);
        } catch (e) {
            console.error(e);
            return;
        }
        programRef.current = prog;

        const verts = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
        const buf = gl.createBuffer();
        bufRef.current = buf;
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

        gl.useProgram(prog);
        const posLoc = gl.getAttribLocation(prog, 'position');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        uniTimeRef.current = gl.getUniformLocation(prog, 'time');
        uniResRef.current = gl.getUniformLocation(prog, 'resolution');
        gl.clearColor(cc0, cc1, cc2, cc3);

        const fit = () => {
            const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, dprMax));
            const rect = canvas.getBoundingClientRect();
            const W = Math.floor(Math.max(1, rect.width) * dpr);
            const H = Math.floor(Math.max(1, rect.height) * dpr);
            if (canvas.width !== W || canvas.height !== H) {
                canvas.width = W;
                canvas.height = H;
            }
            gl.viewport(0, 0, canvas.width, canvas.height);
        };

        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(canvas);
        window.addEventListener('resize', fit);

        const loop = (now) => {
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(prog);
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            if (uniResRef.current) gl.uniform2f(uniResRef.current, canvas.width, canvas.height);
            if (uniTimeRef.current) gl.uniform1f(uniTimeRef.current, now * 1e-3);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);

        return () => {
            ro.disconnect();
            window.removeEventListener('resize', fit);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (bufRef.current) gl.deleteBuffer(bufRef.current);
            if (programRef.current) gl.deleteProgram(programRef.current);
        };
    }, [fragmentSource, dprMax, cc0, cc1, cc2, cc3]);

    return (
        <section
            className={className}
            style={{ height, position: 'relative', overflow: 'hidden' }}
        >
            {/* WebGL Canvas */}
            <canvas
                ref={canvasRef}
                role="img"
                aria-label={ariaLabel}
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    userSelect: 'none',
                    touchAction: 'none',
                }}
            />

            {/* Overlay gradient */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: overlayGradient,
                    pointerEvents: 'none',
                }}
            />

            {/* Content slot */}
            <div style={{ position: 'relative', zIndex: 2, height: '100%' }}>
                {children}
            </div>
        </section>
    );
};

export { AetherHero };
export default AetherHero;
